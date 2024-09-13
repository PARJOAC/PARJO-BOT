const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setname')
    .setDescription('Cambiar el nombre del bot')
    .addStringOption(option => option
      .setName('usuario')
      .setDescription('Escribe el nuevo nombre del bot')
      .setRequired(true)),
  category: "owner",
  name: "setname",
  execute: async (interaction, client) => {

    if (interaction.user.id !== "714376484139040809")
      return;

    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Ver")
        .setURL(`https://discord.com/users/${client.user.id}`)
    );

    const newUsername = interaction.options.getstring("usuario");

    try {
      await client.user.setUsername(newUsername);

      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`Cambió exitosamente el nombre a: ${newUsername}`)
          .setColor("Red")
        ],
        components: [button],
      });
    } catch (error) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Se ha producido un error.")
          .setColor("Red")
        ]
      });
    }
  },
};