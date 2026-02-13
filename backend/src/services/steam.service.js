const { JsonDb } = require("../utils/jsonDb");

const ordersDb = new JsonDb("orders.json");

async function attachSteamToOrder(order_nsu, steamId64) {
  const orders = await ordersDb.read();
  const order = orders.find(o => o.order_nsu === order_nsu);
  if (!order) throw new Error("Order not found");

  order.steamId64 = steamId64;
  await ordersDb.write(orders);
  return order;
}

module.exports = { attachSteamToOrder };