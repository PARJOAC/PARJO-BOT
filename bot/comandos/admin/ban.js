const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear un usuario del servidor')
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('Escribe el usuario a banear')
      .setRequired(true))
    .addStringOption(option => option
      .setName('razon')
      .setDescription('Escribe la razón del baneo'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  category: "mod",
  usage: "${PREFIX}ban [usuario] [razón]",
  name: "ban",
  execute: async (interaction, client) => {
    let usuario = interaction.options.getUser("usuario");
    const miembro = await interaction.guild.members.fetch(usuario.id)
    let razon = interaction.options.getString("razon") || "No se proporcionó ninguna razón.";
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ embeds: [permisos.banBot()], ephemeral: true });

    if (!miembro)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Este usuario no existe.")
          .setColor("Red")
        ], ephemeral: true
      });
    if (!miembro.bannable)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Este usuario no puede ser baneado.")
          .setColor("Red")
        ], ephemeral: true
      });
    if (miembro.roles.highest.comparePositionTo(interaction.member.roles.highest) > 0)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("El usuario mencionado no puede ser baneado, está por encima de tu jerarquía.")
          .setColor("Red")
        ], ephemeral: true
      });

    await miembro.ban({ reason: razon });


    interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle(`${interaction.user.username} (ID ${interaction.user.id})`)
        .setColor("Green")
        .setDescription(`🚫 Ban: ${miembro.user} (ID ${miembro.id}) \n📝 Razón: ${razon}`)], ephemeral: true
    });
  },
};