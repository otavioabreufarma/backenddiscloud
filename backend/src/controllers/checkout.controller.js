const { generateCheckout } = require("../services/infinitepay.service");

async function createCheckoutController(req, res, next) {
  try {
    const checkoutUrl = await generateCheckout(req.params.order_nsu);
    res.json({ checkoutUrl });
  } catch (err) {
    next(err);
  }
}

module.exports = { createCheckoutController };
