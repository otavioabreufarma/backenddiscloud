const { Router } = require("express");
const { infinitePayWebhookController } = require("../controllers/webhook.controller");

const router = Router();

router.post("/infinitepay", infinitePayWebhookController);

module.exports = router;