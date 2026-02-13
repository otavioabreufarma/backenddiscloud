const { getVipBySteamId } = require("../services/vip.service");

async function getVipStatusController(req, res, next) {
  try {
    const { steamId64 } = req.params;

    if (!steamId64) {
      return res.status(400).json({ error: "Missing steamId64" });
    }

    const vip = await getVipBySteamId(steamId64);

    if (!vip) {
      return res.json({
        active: false
      });
    }

    return res.json({
      active: true,
      serverId: vip.serverId,
      vipType: vip.vipType,
      expiresAt: vip.expiresAt
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getVipStatusController
};