const { EmbedBuilder, PermissionsBitField, ChannelType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Escribir algo por el bot')
    .addChannelOption(option => option
      .setName('canal')
      .setDescription('Escribe el canal donde se escribirá')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    .addStringOption(option => option
      .setName('mensaje')
      .setDescription('Mensaje que va a escribir el bot')
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "mod",
  name: "say",
  execute: async (interaction, client) => {
    let canal = interaction.options.getChannel("canal");
    let mensaje = interaction.options.getString("mensaje");

    const channel = interaction.guild.channels.cache.get(canal) ||
      interaction.guild.channels.resolve(canal);

    if (!channel)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Especificar el canal")
          .setColor("Red")
        ], ephemeral: true
      });

    if (!mensaje)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Especifica lo que quieres decir.")
          .setColor("Red")
        ], ephemeral: true
      });

    await channel.send(mensaje);
    interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription("Se ha enviado el mensaje al canal especificado.")
        .setColor("Green")
      ], ephemeral: true
    })
  },
};
