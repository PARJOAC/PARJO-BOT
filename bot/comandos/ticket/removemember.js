const Tickets = require("../../../schemas/tickets.js");
const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removemember')
    .setDescription('Elimina un miembro al sistema de tickets')
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('Escribe el usuario a eliminar')
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "tickets",
  name: "removemember",
  execute: async (interaction, client) => {
    let usuario = interaction.options.getUser("usuario");
    let data = await Tickets.findOne({ Guild: interaction.guild.id });
    if (!data)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Primero debes establecer el rol de tickets.")
          .setColor("Red")
        ], ephemeral: true
      })

    const ticketRole = interaction.guild.roles.cache.find(role => role.id === data.Role);

    if (!ticketRole)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription('No se encontró el rol de Ticket.')
          .setColor("Red")
        ], ephemeral: true
      });

    if (!interaction.member.roles.cache.has(ticketRole.id))
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription('Solo los miembros con la función Ticket pueden usar este comando')
          .setColor("Red")
        ], ephemeral: true
      });

    const memberId = interaction.guild.members.resolve(usuario);
    if (!memberId)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription('Debes proporcionar el ID o mención del usuario que quieres añadir al ticket.')
          .setColor("Red")
        ], ephemeral: true
      });

    try {
      const memberToRemove = await interaction.guild.members.fetch(memberId);

      if (!memberToRemove.roles.cache.has(ticketRole.id))
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription('El miembro ya fue eliminado del sistema de tickets o no tiene el rol.')
            .setColor("Red")
          ], ephemeral: true
        });

      await memberToRemove.roles.remove(ticketRole);
      interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`Miembro ${memberToRemove.user.tag} ha sido eliminado del sistema de tickets.`)
          .setColor("Green")
        ], ephemeral: true
      });
    } catch (error) {
      interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription('No se pudo encontrar el miembro o hubo un error al eliminar el rol.')
          .setColor("Red")
        ], ephemeral: true
      });
    }
  }
}