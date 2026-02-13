const { confirmPayment } = require("../services/infinitepay.service");
const { activateVip } = require("../services/vip.service");

function isWebhookAuthorized(req) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true;
  return req.headers["x-webhook-secret"] === secret;
}

async function infinitePayWebhookController(req, res) {
  try {
    if (!isWebhookAuthorized(req)) {
      return res.status(401).json({ error: "Unauthorized webhook" });
    }

    const {
      order_nsu,
      paid_amount,
      transaction_nsu,
      invoice_slug,
      capture_method
    } = req.body || {};

    if (!order_nsu) {
      return res.status(400).json({ error: "order_nsu é obrigatório" });
    }

    await confirmPayment({
      order_nsu,
      paid_amount,
      transaction_nsu,
      slug: invoice_slug,
      capture_method
    });

    await activateVip(order_nsu);

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

module.exports = { infinitePayWebhookController };
