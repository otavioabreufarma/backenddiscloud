const { Router } = require("express");
const { botAuth } = require("../middlewares/auth.middleware");
const {
  getVipStatusController
} = require("../controllers/vip.controller");

const router = Router();

/**
 * Consultar status do VIP de um SteamID
 * Usado pelo plugin Rust e pelo bot
 */
router.get("/status/:steamId64", botAuth, getVipStatusController);

module.exports = router;