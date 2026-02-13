const {
  createOrder,
  getOrderByNsu,
  getPendingOrderBySteam,
  getPendingOrderByDiscord,
  updateOrder
} = require("../services/orders.service");

async function createOrderController(req, res, next) {
  try {
    const { discordId } = req.body;
    const order = await createOrder({ discordId });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrderController(req, res, next) {
  try {
    const order = await getOrderByNsu(req.params.order_nsu);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrderBySteamController(req, res, next) {
  try {
    const order = await getPendingOrderBySteam(req.params.steamId64);
    if (!order) return res.status(404).json({ error: "No pending order found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function getOrderByDiscordController(req, res, next) {
  try {
    const order = await getPendingOrderByDiscord(req.params.discordId);
    if (!order) return res.status(404).json({ error: "No pending order found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function updateOrderController(req, res, next) {
  try {
    const updated = await updateOrder(req.params.order_nsu, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrderController,
  getOrderController,
  getOrderBySteamController,
  getOrderByDiscordController,
  updateOrderController
};
