const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require("discord.js");

function connectSteamButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("connect_steam")
      .setLabel("🔗 Conectar Steam")
      .setStyle(ButtonStyle.Primary)
  );
}

function steamDoneButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("steam_done")
      .setLabel("✅ Já conectei minha Steam")
      .setStyle(ButtonStyle.Success)
  );
}

function serverSelect(servers = []) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_server")
      .setPlaceholder("Selecione o servidor")
      .addOptions(
        servers.map(server => ({
          label: server.name,
          value: server.id
        }))
      )
  );
}

function vipSelect() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_vip")
      .setPlaceholder("Selecione o VIP")
      .addOptions([
        { label: "VIP - R$15", value: "vip" },
        { label: "VIP+ - R$30", value: "vip+" }
      ])
  );
}

function buyButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("buy_vip")
      .setLabel("💳 Comprar VIP")
      .setStyle(ButtonStyle.Success)
  );
}

module.exports = {
  connectSteamButton,
  steamDoneButton,
  serverSelect,
  vipSelect,
  buyButton
};
