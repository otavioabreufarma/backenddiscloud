const { Router } = require("express");
const passport = require("passport");
const { steamReturnUrl } = require("../config/env");
const { attachSteamToOrder } = require("../services/orders.service");

const router = Router();

router.get("/login", (req, res, next) => {
  const { order_nsu } = req.query;
  if (!order_nsu) {
    return res.status(400).send("order_nsu is required");
  }

  req.session.order_nsu = order_nsu;

  return passport.authenticate("steam", {
    returnURL: `${steamReturnUrl}?order_nsu=${encodeURIComponent(order_nsu)}`
  })(req, res, next);
});

router.get(
  "/callback",
  passport.authenticate("steam", { failureRedirect: "/" }),
  async (req, res, next) => {
    try {
      const steamId64 = req.user.steamId64;
      const order_nsu = req.query.order_nsu || req.session.order_nsu;

      await attachSteamToOrder({ order_nsu, steamId64 });

      res.send("Steam conectada com sucesso. Volte ao Discord e clique em 'Já conectei minha Steam'.");
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
