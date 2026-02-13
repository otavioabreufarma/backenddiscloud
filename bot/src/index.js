const client = require("./client");
const { discordToken } = require("./config/env");
const { handleInteraction } = require("./handlers/interaction.handler");
const { initVipChannel } = require("./ui/initVipChannel");

client.once("ready", async () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);

  try {
    await initVipChannel(client);
  } catch (err) {
    console.error("❌ Erro ao inicializar canal VIP:", err.message);
  }
});

client.on("interactionCreate", handleInteraction);

client.login(discordToken);