const { Router } = require("express");
const { botAuth } = require("../middlewares/auth.middleware");

const {
  createOrderController,
  getOrderBySteamController,
  getOrderByDiscordController,
  getOrderController,
  updateOrderController
} = require("../controllers/orders.controller");
const { createCheckoutController } = require("../controllers/checkout.controller");

const router = Router();

router.post("/", botAuth, createOrderController);
router.get("/by-steam/:steamId64", botAuth, getOrderBySteamController);
router.get("/by-discord/:discordId", botAuth, getOrderByDiscordController);
router.get("/:order_nsu", botAuth, getOrderController);
router.patch("/:order_nsu", botAuth, updateOrderController);
router.post("/checkout/:order_nsu", botAuth, createCheckoutController);

module.exports = router;
