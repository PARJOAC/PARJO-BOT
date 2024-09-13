const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bug')
    .setDescription('Informar de un error del bot')
    .addStringOption(option => option
      .setName('comentario')
      .setDescription('Describe el bug que encontraste')
      .setRequired(true)),
  category: "info",
  name: "bug",
  execute: async (interaction, client) => {

    const botOwnerUser = await interaction.client.users.fetch("714376484139040809");
    await botOwnerUser.send({
      embeds: [new EmbedBuilder()
        .setTitle('Reporte de error')
        .setColor('Green')
        .setDescription(`**Error:**\n${interaction.options.getString('comentario')}\n\n**Usuario:**\n${interaction.user} (${interaction.user.id})`)
      ]
    });

    return interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription('Gracias por informar del error. El informe ha sido enviado al propietario del bot.')
        .setColor("Green")
      ], ephemeral: true
    });
  },
};