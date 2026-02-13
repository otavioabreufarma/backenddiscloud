const { JsonDb } = require("../utils/jsonDb");

const serversDb = new JsonDb("servers.json");

async function listServersController(req, res, next) {
  try {
    const servers = await serversDb.read();
    res.json(servers);
  } catch (err) {
    next(err);
  }
}

module.exports = { listServersController };
