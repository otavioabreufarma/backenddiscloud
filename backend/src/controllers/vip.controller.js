const { getVipBySteamId } = require("../services/vip.service");
const { requireBotToken } = require("../utils/requestAuth");

async function getVipStatusController(req, res) {
  if (!requireBotToken(req, res)) return;

  try {
    const { steamId64 } = req.params;

    if (!steamId64) {
      return res.status(400).json({ error: "Missing steamId64" });
    }

    const vip = await getVipBySteamId(steamId64);

    if (!vip) {
      return res.json({ active: false });
    }

    return res.json({
      active: true,
      serverId: vip.serverId,
      vipType: vip.vipType,
      expiresAt: vip.expiresAt
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getVipStatusController };
