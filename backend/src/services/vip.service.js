const path = require("path");
const jsonfile = require("jsonfile");
const { JsonDb } = require("../utils/jsonDb");

const vipFile = path.join(__dirname, "../storage/vips.json");
const ordersDb = new JsonDb("orders.json");

async function readVips() {
  try {
    return await jsonfile.readFile(vipFile);
  } catch {
    return [];
  }
}

async function writeVips(vips) {
  await jsonfile.writeFile(vipFile, vips, { spaces: 2 });
}

async function activateVip(order_nsu) {
  const orders = await ordersDb.read();
  const order = orders.find(o => o.order_nsu === order_nsu);

  if (!order) throw new Error("Order not found");
  if (!order.steamId64 || !order.serverId || !order.vipType) {
    throw new Error("Order is incomplete for VIP activation");
  }

  const vips = await readVips();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const existing = vips.find(v => v.steamId64 === order.steamId64 && v.serverId === order.serverId);
  if (existing) {
    existing.vipType = order.vipType;
    existing.active = true;
    existing.activatedAt = now.toISOString();
    existing.expiresAt = expiresAt;
  } else {
    vips.push({
      steamId64: order.steamId64,
      serverId: order.serverId,
      vipType: order.vipType,
      active: true,
      activatedAt: now.toISOString(),
      expiresAt
    });
  }

  await writeVips(vips);
  return { steamId64: order.steamId64, serverId: order.serverId, vipType: order.vipType, expiresAt };
}

async function getVipBySteamId(steamId64) {
  const vips = await readVips();
  return vips.find(v => v.steamId64 === steamId64 && v.active) || null;
}

module.exports = {
  activateVip,
  getVipBySteamId
};
