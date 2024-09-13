const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");
const Mutes = require('../../../schemas/mute.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setmuterol')
    .setDescription('Establecer el rol de muteo')
    .addRoleOption(option => option
      .setName('rol')
      .setDescription('Selecciona el rol para muteados')
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "mod",
  name: "setmuterol",
  execute: async (interaction, client) => {
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles))
      return interaction.reply({ embeds: [permisos.manejar_roles_bot()], ephemeral: true });

    const targetRole = interaction.options.getRole("rol");

    if (!targetRole.editable)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Este rol no se puede editar.")
          .setColor("Red")
        ], ephemeral: true
      });

    if (targetRole.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("El rol es más alto en jerarquía que el mío.")
          .setColor("Red")
        ], ephemeral: true
      });

    let muteRole = await Mutes.findOne({ Guild: interaction.guild.id }).exec();
    if (muteRole) {
      await muteRole.updateOne({ Rol: targetRole.id });
    } else {
      await new Mutes({ Guild: interaction.guild.id, Rol: targetRole.id }).save();
    }

    interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription(`El rol **${targetRole}** se ha establecido como el rol para silenciar miembros.`)
        .setColor("Green")
      ], ephemeral: true
    });
  },
};