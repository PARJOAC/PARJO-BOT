const Tickets = require("../../../schemas/tickets.js");
const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmember')
    .setDescription('Agregar un miembro al sistema de tickets')
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('Escribe el usuario a añadir')
      .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "tickets",
  name: "addmember",
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

    const memberId = interaction.guild.members.resolve(usuario);

    if (!ticketRole)
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription('No existe el rol de Tickets.')
          .setColor("Red")
        ], ephemeral: true
      });

    try {
      const memberToAdd = await interaction.guild.members.fetch(memberId);

      if (memberToAdd.roles.cache.has(ticketRole.id))
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription('El miembro ya está agregado al sistema de tickets.')
            .setColor("Red")
          ], ephemeral: true
        });

      await memberToAdd.roles.add(ticketRole);
      interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`Miembro ${memberToAdd.user} ha sido añadido al sistema de tickets.`)
          .setColor("Green")
        ], ephemeral: true
      });
    } catch (error) {
      interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription('No se pudo encontrar el miembro o hubo un error al agregar el rol.')
          .setColor("Red")
        ], ephemeral: true
      });
    }
  }
}