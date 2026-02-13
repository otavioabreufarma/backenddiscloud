const {
  createOrder,
  getOrderByNsu,
  getPendingOrderBySteam,
  getPendingOrderByDiscord,
  updateOrder
} = require("../services/orders.service");
const { requireBotToken } = require("../utils/requestAuth");

async function createOrderController(req, res) {
  if (!requireBotToken(req, res)) return;
  try {
    const { discordId } = req.body;
    const order = await createOrder({ discordId });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getOrderController(req, res) {
  if (!requireBotToken(req, res)) return;
  try {
    const order = await getOrderByNsu(req.params.order_nsu);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getOrderBySteamController(req, res) {
  if (!requireBotToken(req, res)) return;
  try {
    const order = await getPendingOrderBySteam(req.params.steamId64);
    if (!order) return res.status(404).json({ error: "No pending order found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getOrderByDiscordController(req, res) {
  if (!requireBotToken(req, res)) return;
  try {
    const order = await getPendingOrderByDiscord(req.params.discordId);
    if (!order) return res.status(404).json({ error: "No pending order found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateOrderController(req, res) {
  if (!requireBotToken(req, res)) return;
  try {
    const updated = await updateOrder(req.params.order_nsu, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createOrderController,
  getOrderController,
  getOrderBySteamController,
  getOrderByDiscordController,
  updateOrderController
};
