const { serverSelect, vipSelect, buyButton, steamDoneButton } = require("../ui/components");
const {
  createOrder,
  updateOrder,
  createCheckout,
  getOrderByDiscord,
  listServers
} = require("../services/backend.service");

const userState = new Map();

async function handleInteraction(interaction) {
  try {
    if (interaction.isButton() && interaction.customId === "connect_steam") {
      await interaction.deferReply({ ephemeral: true });

      const order = await createOrder({ discordId: interaction.user.id });
      userState.set(interaction.user.id, { order_nsu: order.order_nsu });

      return interaction.editReply({
        content:
          `🔗 **Passo 1: Conectar Steam**\n\n${order.steamLoginUrl}\n\n` +
          "Após conectar, clique no botão abaixo.",
        components: [steamDoneButton()]
      });
    }

    if (interaction.isButton() && interaction.customId === "steam_done") {
      await interaction.deferReply({ ephemeral: true });

      const [order, servers] = await Promise.all([
        getOrderByDiscord(interaction.user.id),
        listServers()
      ]);

      userState.set(interaction.user.id, {
        order_nsu: order.order_nsu,
        serverId: order.serverId,
        vipType: order.vipType
      });

      return interaction.editReply({
        content: "✅ Steam conectada! Agora escolha o servidor e o VIP.",
        components: [serverSelect(servers), vipSelect(), buyButton()]
      });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "select_server") {
      const state = userState.get(interaction.user.id) || {};
      state.serverId = interaction.values[0];
      userState.set(interaction.user.id, state);
      return interaction.reply({ content: "Servidor selecionado.", ephemeral: true });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "select_vip") {
      const state = userState.get(interaction.user.id) || {};
      state.vipType = interaction.values[0];
      userState.set(interaction.user.id, state);
      return interaction.reply({ content: "VIP selecionado.", ephemeral: true });
    }

    if (interaction.isButton() && interaction.customId === "buy_vip") {
      const state = userState.get(interaction.user.id) || {};
      if (!state.order_nsu || !state.serverId || !state.vipType) {
        return interaction.reply({
          content: "⚠️ Você precisa conectar Steam, escolher servidor e VIP antes de comprar.",
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      await updateOrder(state.order_nsu, {
        serverId: state.serverId,
        vipType: state.vipType
      });

      const checkoutUrl = await createCheckout(state.order_nsu);

      return interaction.editReply({
        content:
          `💳 **Pagamento**\n\n${checkoutUrl}\n\n` +
          "Após o pagamento, o VIP será ativado automaticamente."
      });
    }
  } catch (err) {
    console.error(err);
    if (interaction.deferred) return interaction.editReply("❌ Ocorreu um erro na integração com o backend.");
    return interaction.reply({ content: "❌ Ocorreu um erro na integração com o backend.", ephemeral: true });
  }
}

module.exports = { handleInteraction };
