const { JsonDb } = require("../utils/jsonDb");
const { baseUrl } = require("../config/env");

const ordersDb = new JsonDb("orders.json");

async function generateCheckout(order_nsu) {
  const orders = await ordersDb.read();
  const order = orders.find(o => o.order_nsu === order_nsu);
  if (!order || !order.steamId64) throw new Error("Invalid order");

  if (!order.checkoutUrl) {
    order.checkoutUrl =
      `https://checkout.infinitepay.io/pay?reference=${order_nsu}` +
      `&amount=${order.price * 100}` +
      `&callback_url=${baseUrl}/api/webhooks/infinitepay`;
    await ordersDb.write(orders);
  }

  return order.checkoutUrl;
}

async function confirmPayment({ order_nsu, amount }) {
  const orders = await ordersDb.read();
  const order = orders.find(o => o.order_nsu === order_nsu);
  if (order.status === "PAID") return order;

  if (amount !== order.price * 100) throw new Error("Invalid amount");

  order.status = "PAID";
  order.paidAt = new Date().toISOString();
  await ordersDb.write(orders);
  return order;
}

module.exports = { generateCheckout, confirmPayment };