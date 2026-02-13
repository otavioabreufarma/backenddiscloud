const { JsonDb } = require("../utils/jsonDb");
const axios = require("axios");
const { rustToken, rustPluginUrl } = require("../config/env");

const vipsDb = new JsonDb("vips.json");

function startVipExpirationJob() {
  setInterval(async () => {
    const vips = await vipsDb.read();
    const now = new Date();

    for (const vip of vips) {
      if (!vip.active) continue;
      if (new Date(vip.expiresAt) > now) continue;

      await axios.post(
        `${rustPluginUrl}/vip/remove`,
        vip,
        { headers: { "x-rust-token": rustToken } }
      );

      vip.active = false;
    }

    await vipsDb.write(vips);
  }, 300000);
}

module.exports = { startVipExpirationJob };