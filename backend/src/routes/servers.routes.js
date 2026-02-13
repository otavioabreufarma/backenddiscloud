const { Router } = require("express");
const { listServersController } = require("../controllers/servers.controller");

const router = Router();
router.get("/", listServersController);

module.exports = router;
