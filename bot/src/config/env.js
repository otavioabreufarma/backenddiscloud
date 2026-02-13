require("dotenv").config();

function required(name) {
  if (!process.env[name]) {
    throw new Error(`Missing env: ${name}`);
  }
  return process.env[name];
}

module.exports = {
  discordToken: required("DISCORD_TOKEN"),
  clientId: required("CLIENT_ID"),
  backendUrl: required("BACKEND_URL"),
  backendBotToken: required("BACKEND_BOT_TOKEN"),
  vipChannelId: required("VIP_CHANNEL_ID")
};
