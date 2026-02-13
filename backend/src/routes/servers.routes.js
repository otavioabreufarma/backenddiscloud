const { Router } = require("express");
const { botAuth } = require("../middlewares/auth.middleware");
const { listServersController } = require("../controllers/servers.controller");

const router = Router();
router.get("/", botAuth, listServersController);

module.exports = router;
