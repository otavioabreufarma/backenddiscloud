const { generateCheckout } = require("../services/infinitepay.service");
const { requireBotToken } = require("../utils/requestAuth");

async function createCheckoutController(req, res) {
  if (!requireBotToken(req, res)) return;

  try {
    const checkoutUrl = await generateCheckout(req.params.order_nsu);
    res.json({ checkoutUrl });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { createCheckoutController };
