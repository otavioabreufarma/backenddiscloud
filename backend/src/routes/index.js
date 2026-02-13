const { Router } = require("express");

const orders = require("./orders.routes");
const steam = require("./steam.routes");
const webhooks = require("./webhook.routes");
const vip = require("./vip.routes");
const servers = require("./servers.routes");

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true }));
router.use("/orders", orders);
router.use("/auth/steam", steam);
router.use("/webhooks", webhooks);
router.use("/vip", vip);
router.use("/servers", servers);

module.exports = router;
