const { connectSteamButton } = require("./components");
const { createVipEmbed } = require("./vipEmbed");
const { vipChannelId, backendUrl } = require("../config/env");

async function initVipChannel(client) {
  const channel = await client.channels.fetch(vipChannelId);
  if (!channel?.isTextBased()) return;

  const messages = await channel.messages.fetch({ limit: 20 });
  for (const msg of messages.values()) {
    if (msg.author.id === client.user.id) {
      await msg.delete().catch(() => {});
    }
  }

  await channel.send({
    embeds: [createVipEmbed()],
    components: [connectSteamButton()]
  });
}

module.exports = { initVipChannel };