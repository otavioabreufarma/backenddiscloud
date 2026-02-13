const axios = require("axios");
const { JsonDb } = require("../utils/jsonDb");
const { baseUrl } = require("../config/env");

const ordersDb = new JsonDb("orders.json");
const INFINITE_BASE = "https://api.infinitepay.io/invoices/public/checkout";

function getHandle() {
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) throw new Error("INFINITEPAY_HANDLE não configurado");
  return handle;
}

function buildItems(order) {
  const description = `VIP ${order.vipType || "vip"} | Servidor ${order.serverId || "N/A"}`;
  return [{ quantity: 1, price: Math.round(Number(order.price || 0) * 100), description }];
}

function parseCheckoutUrl(data) {
  return (
    data?.checkout_url ||
    data?.payment_url ||
    data?.url ||
    data?.link ||
    data?.data?.checkout_url ||
    data?.data?.url ||
    null
  );
}

async function generateCheckout(order_nsu) {
  const orders = await ordersDb.read();
  const order = orders.find((o) => o.order_nsu === order_nsu);

  if (!order) throw new Error("Pedido não encontrado");
  if (!order.steamId64) throw new Error("Conecte a Steam antes de gerar checkout");
  if (!order.serverId || !order.vipType || !order.price) {
    throw new Error("Pedido incompleto: defina servidor e tipo de VIP antes do checkout");
  }

  if (order.checkoutUrl) return order.checkoutUrl;

  const payload = {
    handle: getHandle(),
    items: buildItems(order),
    order_nsu: order.order_nsu,
    redirect_url: process.env.INFINITEPAY_REDIRECT_URL || `${baseUrl}/checkout/sucesso`,
    webhook_url: `${baseUrl}/api/webhooks/infinitepay`
  };

  const { data } = await axios.post(`${INFINITE_BASE}/links`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  const checkoutUrl = parseCheckoutUrl(data);
  if (!checkoutUrl) {
    throw new Error("InfinitePay não retornou URL de checkout");
  }

  order.checkoutUrl = checkoutUrl;
  if (data?.slug) order.slug = data.slug;
  await ordersDb.write(orders);

  return checkoutUrl;
}

async function checkPayment({ order_nsu, transaction_nsu, slug }) {
  const payload = {
    handle: getHandle(),
    order_nsu,
    transaction_nsu,
    slug
  };

  const { data } = await axios.post(`${INFINITE_BASE}/payment_check`, payload, {
    headers: { "Content-Type": "application/json" }
  });

  return data;
}

async function confirmPayment({ order_nsu, paid_amount, transaction_nsu, slug, capture_method }) {
  const orders = await ordersDb.read();
  const order = orders.find((o) => o.order_nsu === order_nsu);
  if (!order) throw new Error("Order not found");

  if (order.status === "PAID") return order;

  order.status = "PAID";
  order.paidAt = new Date().toISOString();
  order.paidAmount = paid_amount ?? null;
  order.transaction_nsu = transaction_nsu || null;
  order.slug = slug || order.slug || null;
  order.capture_method = capture_method || null;

  await ordersDb.write(orders);
  return order;
}

module.exports = { generateCheckout, confirmPayment, checkPayment };
