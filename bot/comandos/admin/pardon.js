const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pardon')
    .setDescription('Informar de un error del bot')
    .addStringOption(option => option
      .setName('usuario')
      .setDescription('Escribe el ID del usuario')
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  category: "mod",
  name: "mute",
  execute: async (interaction, client) => {
    let userID = interaction.options.getString('usuario');
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ embeds: [permisos.banBot()], ephemeral: true });

    if (!userID)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Escribe un ID válido del usuario a desbanear.")
          .setColor("Red")
        ], ephemeral: true
      });

    const bans = await interaction.guild.bans.fetch();
    if (bans.size === 0)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("No hay baneos registrados en este servidor.")
          .setColor("Red")
        ], ephemeral: true
      });

    const unbanUser = bans.find((b) => b.user.id === userID);
    if (!unbanUser)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("El mencionado usuario no existe.")
          .setColor("Red")
        ], ephemeral: true
      });

    await interaction.guild.members.unban(unbanUser.user);

    interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription(`Se ha desbaneado con éxito a <@${userID}> (${userID}).`)
        .setColor("Green")
      ], ephemeral: true
    });
  },
};