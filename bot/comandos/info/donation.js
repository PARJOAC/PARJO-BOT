const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("donation")
    .setDescription("Haz una donación al creador del bot"),
  category: "info",
  name: "donation",
  execute: async (interaction, client) => {
    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor("Green")
        .setDescription(`Para donar, haga clic [aquí](https://streamlabs.com/acparjo/tip). Gracias de antemano por usar el bot.`)
      ], ephemeral: true
    });
  },
};