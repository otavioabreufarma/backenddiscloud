const app = require("./app");
const { port } = require("./config/env");
const { startVipExpirationJob } = require("./jobs/vipExpiration.job");
const { logger } = require("./utils/logger");

app.listen(port, () => {
  logger.info(`Backend running on port ${port}`);
  startVipExpirationJob();
});