const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsar un usuario del servidor')
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('Escribe el usuario a expulsar')
      .setRequired(true))
    .addStringOption(option => option
      .setName('razon')
      .setDescription('Escribe la razón de la expulsión'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  category: "mod",
  name: "kick",
  execute: async (interaction, client) => {
    let usuario = interaction.options.getUser("usuario");
    let miembro = await interaction.guild.members.fetch(usuario.id)
    let razon = interaction.options.getString("razon") || "Sin razón.";
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers))
      return interaction.reply({ embeds: [permisos.kickBot()], ephemeral: true });

    if (!miembro)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Este usuario no existe.")
          .setColor("Red")
        ], ephemeral: true
      });
    if (!miembro.kickable)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("No puedo expulsar al mencionado usuario.")
          .setColor("Red")
        ], ephemeral: true
      });

    await miembro.kick();

    interaction.reply({
      embeds: [new EmbedBuilder()
        .setColor("Green")
        .setTitle(`${interaction.user.username} (ID ${interaction.user.id})`)
        .setDescription(`⚠️ Kick: ${miembro.user} (ID ${miembro.id})\n📝 Razón: ${reason}`)
      ], ephemeral: true
    });
  },
};