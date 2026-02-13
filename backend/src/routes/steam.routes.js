const { Router } = require("express");
const { attachSteamToOrder } = require("../services/orders.service");
const {
  buildSteamLoginRedirectUrl,
  validateSteamOpenIdCallback,
  extractSteamId64
} = require("../services/steam.service");

const router = Router();

router.get("/login", (req, res) => {
  const { order_nsu } = req.query;
  if (!order_nsu) {
    return res.status(400).send("order_nsu is required");
  }

  const redirectUrl = buildSteamLoginRedirectUrl(String(order_nsu));
  return res.redirect(302, redirectUrl);
});

router.get("/callback", async (req, res) => {
  try {
    const isValid = await validateSteamOpenIdCallback(req.query);
    if (!isValid) {
      return res.status(401).send("Falha ao validar retorno OpenID da Steam");
    }

    const steamId64 = extractSteamId64(req.query["openid.claimed_id"]);
    const order_nsu = req.query.order_nsu;

    if (!steamId64 || !order_nsu) {
      return res.status(400).send("SteamID ou order_nsu ausente no callback");
    }

    await attachSteamToOrder({ order_nsu: String(order_nsu), steamId64 });

    return res.send("Steam conectada com sucesso. Volte ao Discord e clique em 'Já conectei minha Steam'.");
  } catch (err) {
    return res.status(400).send(`Erro ao conectar Steam: ${err.message}`);
  }
});

module.exports = router;
