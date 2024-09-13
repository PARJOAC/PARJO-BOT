const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Buscar en Google")
    .addStringOption(option => option
      .setName("busqueda")
      .setDescription("Lo que quieres buscar")
      .setRequired(true)),
  category: "info",
  name: "google",
  execute: async (interaction, client) => {
    let nombre = encodeURIComponent(interaction.options.getString("busqueda"));
    let link = `https://www.google.com/search?q=${nombre}`;

    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription(`He encontrado lo siguiente para: \`${interaction.options.getString("busqueda")}\``)
        .addFields([
          {
            name: `🔗┇Link`,
            value: `[Haga clic aquí para ver el enlace](${link})`,
            inline: true,
          }
        ])
      ], ephemeral: true
    });
  },
};
