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
  botToken: required("BOT_TOKEN"),
  rustToken: required("RUST_TOKEN"),
  webhookSecret: required("WEBHOOK_SECRET"),
  steamApiKey: required("STEAM_API_KEY"),
  steamRealm: required("STEAM_REALM"),
  steamReturnUrl: required("STEAM_RETURN_URL"),
  rustPluginUrl: required("RUST_PLUGIN_URL")
};