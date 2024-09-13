const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const permisos = require("../../../extras/permisos.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banlist')
    .setDescription('Ver la lista de usuarios baneados del servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  category: "mod",
  name: "banlist",
  execute: async (interaction, client) => {
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers))
      return interaction.reply({ embeds: [permisos.banBot()], ephemeral: true });

    interaction.guild.bans.fetch().then(async banned => {
      let list = banned.map(banUser => `**${banUser.user.username}** (ID: ${banUser.user.id})・**Razón:** ${banUser.reason || 'Sin razón'}`);

      if (list.length == 0)
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription(`En este servidor no hay usuarios baneados.`)
            .setColor("Red")
          ], ephemeral: true
        })

      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`🔧・Banlist - ${interaction.guild.name}\n` + list)
          .setColor("Green")
        ], ephemeral: true
      })
    })
  }
}