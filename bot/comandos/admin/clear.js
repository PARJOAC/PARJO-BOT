const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpieza del chat')
    .addIntegerOption(option => option
      .setName('numero')
      .setDescription('Escribe un número entre 1 y 100')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  category: "mod",
  name: "clear",
  execute: async (interaction, client) => {
    let numero = interaction.options.getInteger("numero");
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return interaction.reply({ embeds: [permisos.manageMessagesBot()], ephemeral: true });

    let deleteAmount = parseInt(numero, 10);

    if (Number.isNaN(deleteAmount) || deleteAmount <= 0 || deleteAmount > 100)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Introduzca un número válido entre 1 y 100.")
          .setColor("Red")
        ], ephemeral: true
      });


    try {
      const fetched = await interaction.channel.messages.fetch({ limit: deleteAmount });
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`Se han eliminado ${deleteAmount} mensajes.`)
          .setColor("Green")
        ], ephemeral: true
      });
      await interaction.channel.bulkDelete(fetched, true);

    } catch (error) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Se produjo un error al eliminar mensajes.")
          .setColor("Red")
        ], ephemeral: true
      });
    }
  },
};
