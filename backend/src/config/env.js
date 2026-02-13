require("dotenv").config();

function required(name) {
  if (!process.env[name]) {
    throw new Error(`Missing env: ${name}`);
  }
  return process.env[name];
}

module.exports = {
  port: Number(process.env.PORT || 8080),
  baseUrl: required("BASE_URL"),
  steamApiKey: process.env.STEAM_API_KEY || "",
  steamRealm: required("STEAM_REALM"),
  steamReturnUrl: required("STEAM_RETURN_URL"),
  botToken: process.env.BOT_TOKEN || "",
  webhookSecret: process.env.WEBHOOK_SECRET || ""
};
