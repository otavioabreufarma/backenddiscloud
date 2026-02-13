const { Router } = require("express");

const {
  createOrderController,
  getOrderBySteamController,
  getOrderByDiscordController,
  getOrderController,
  updateOrderController
} = require("../controllers/orders.controller");
const { createCheckoutController } = require("../controllers/checkout.controller");

const router = Router();

router.post("/", createOrderController);
router.get("/by-steam/:steamId64", getOrderBySteamController);
router.get("/by-discord/:discordId", getOrderByDiscordController);
router.get("/:order_nsu", getOrderController);
router.patch("/:order_nsu", updateOrderController);
router.post("/checkout/:order_nsu", createCheckoutController);

module.exports = router;
