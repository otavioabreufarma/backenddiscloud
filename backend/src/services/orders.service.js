const { v4: uuid } = require("uuid");
const { JsonDb } = require("../utils/jsonDb");
const { baseUrl } = require("../config/env");

const ordersDb = new JsonDb("orders.json");
const serversDb = new JsonDb("servers.json");

const VIP_PRICES = {
  vip: 15,
  "vip+": 30
};

function buildSteamLoginUrl(order_nsu) {
  return `${baseUrl}/api/auth/steam/login?order_nsu=${encodeURIComponent(order_nsu)}`;
}

async function createOrder({ discordId }) {
  if (!discordId) throw new Error("discordId is required");

  const orders = await ordersDb.read();
  const existing = orders.find(o => o.discordId === discordId && o.status === "PENDING");

  if (existing) {
    existing.steamLoginUrl = buildSteamLoginUrl(existing.order_nsu);
    await ordersDb.write(orders);
    return existing;
  }

  const order = {
    order_nsu: `INF-${uuid().slice(0, 8)}`,
    discordId,
    steamId64: null,
    serverId: null,
    vipType: null,
    price: null,
    status: "PENDING",
    checkoutUrl: null,
    steamLoginUrl: null,
    createdAt: new Date().toISOString(),
    paidAt: null
  };

  order.steamLoginUrl = buildSteamLoginUrl(order.order_nsu);
  orders.push(order);
  await ordersDb.write(orders);

  return order;
}

async function attachSteamToOrder({ order_nsu, steamId64 }) {
  if (!order_nsu || !steamId64) throw new Error("order_nsu and steamId64 are required");

  const orders = await ordersDb.read();
  const order = orders.find(o => o.order_nsu === order_nsu);

  if (!order) throw new Error("Order not found");

  order.steamId64 = steamId64;
  await ordersDb.write(orders);
  return order;
}

async function updateOrder(order_nsu, { serverId, vipType }) {
  await validateServerAndVip(serverId, vipType);

  const orders = await ordersDb.read();
  const order = orders.find(o => o.order_nsu === order_nsu);

  if (!order) throw new Error("Order not found");
  if (!order.steamId64) throw new Error("Steam account not connected yet");
  if (order.status !== "PENDING") throw new Error("Order cannot be modified");

  order.serverId = serverId;
  order.vipType = vipType;
  order.price = VIP_PRICES[vipType];

  await ordersDb.write(orders);
  return order;
}

async function getOrderByNsu(order_nsu) {
  const orders = await ordersDb.read();
  return orders.find(o => o.order_nsu === order_nsu) || null;
}

async function getPendingOrderBySteam(steamId64) {
  const orders = await ordersDb.read();
  return orders.find(o => o.steamId64 === steamId64 && o.status === "PENDING") || null;
}

async function getPendingOrderByDiscord(discordId) {
  const orders = await ordersDb.read();
  return orders.find(o => o.discordId === discordId && o.status === "PENDING") || null;
}

async function validateServerAndVip(serverId, vipType) {
  if (!serverId || !vipType) throw new Error("serverId and vipType are required");
  if (!VIP_PRICES[vipType]) throw new Error("Invalid vipType");

  const servers = await serversDb.read();
  const exists = servers.some(s => s.id === serverId);
  if (!exists) throw new Error("Invalid serverId");
}

module.exports = {
  createOrder,
  attachSteamToOrder,
  updateOrder,
  getOrderByNsu,
  getPendingOrderBySteam,
  getPendingOrderByDiscord
};
