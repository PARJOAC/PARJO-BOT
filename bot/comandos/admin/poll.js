const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const permisos = require('../../../extras/permisos.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Crea una encuesta')
    .addStringOption(option => option
      .setName('pregunta')
      .setDescription('Escribe el usuario a mutear')
      .setRequired(true))
    .addStringOption(option => option
      .setName('opcion1')
      .setDescription('Escribe la primera opción')
      .setRequired(true))
    .addStringOption(option => option
      .setName("opcion2")
      .setDescription("Escribe la segunda opción")
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "mod",
  name: "poll",
  execute: async (interaction, client) => {
    let pregunta = interaction.options.getString("pregunta");
    let opcion1 = interaction.options.getString("opcion1");
    let opcion2 = interaction.options.getString("opcion2");
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ embeds: [permisos.administratorBot()], ephemeral: true });

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ embeds: [permisos.administratorUser()], ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('Encuesta')
      .setColor("Green")
      .setDescription(`**Pregunta:\n**${pregunta}\n\n**Primera opción:**\n${opcion1}\n\n**Segunda opción:**\n${opcion2}`);

    const msg = await interaction.channel.send({ embeds: [embed] })
    await msg.react('1️⃣');
    await msg.react('2️⃣');
  },
};
