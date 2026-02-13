const { JsonDb } = require("../utils/jsonDb");
const { requireBotToken } = require("../utils/requestAuth");

const serversDb = new JsonDb("servers.json");

async function listServersController(req, res) {
  if (!requireBotToken(req, res)) return;
  try {
    const servers = await serversDb.read();
    res.json(servers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listServersController };
