const { confirmPayment } = require("../services/infinitepay.service");
const { activateVip } = require("../services/vip.service");
const { webhookSecret } = require("../config/env");

async function infinitePayWebhookController(req, res, next) {
  try {
    if (req.headers["x-webhook-secret"] !== webhookSecret)
      return res.status(401).end();

    const { order_nsu, status, amount } = req.body;
    if (status !== "PAID") return res.json({ ignored: true });

    await confirmPayment({ order_nsu, amount });
    await activateVip(order_nsu);

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}

module.exports = { infinitePayWebhookController };