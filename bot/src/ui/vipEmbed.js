const { EmbedBuilder } = require("discord.js");

function createVipEmbed() {
  return new EmbedBuilder()
    .setTitle("💎 VIP Rust")
    .setDescription(
      "### Passo 1\n" +
      "🔗 Conecte sua **Steam**\n\n" +
      "### Passo 2\n" +
      "Escolha o **servidor** e o **VIP**\n\n" +
      "### Passo 3\n" +
      "Finalize o pagamento"
    )
    .setColor(0xF1C40F)
    .setFooter({ text: "Sistema automático de VIP" });
}

module.exports = { createVipEmbed };