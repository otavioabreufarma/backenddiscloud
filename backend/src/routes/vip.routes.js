const { Router } = require("express");
const { getVipStatusController } = require("../controllers/vip.controller");

const router = Router();
router.get("/status/:steamId64", getVipStatusController);

module.exports = router;
