const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setavatar')
    .setDescription('Cambiar el avatar del bot')
    .addStringOption(option => option
      .setName('link')
      .setDescription('Escribe la URL del nuevo avatar')
      .setRequired(true)),
  category: "owner",
  name: "setavatar",
  execute: async (interaction, client) => {
    let link = interaction.options.getString("link");

    if (interaction.user.id !== "714376484139040809")
      return;

    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Ver")
        .setURL(`https://discord.com/users/${client.user.id}`)
    );

    try {
      const response = await fetch(link);
      if (!response.ok)
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setDescription("No se pudo descargar la imagen.")
            .setColor("Red")
          ], ephemeral: true
        });

      const buffer = await response.buffer();

      await client.user.setAvatar(buffer);

      interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Cambió exitosamente el avatar")
          .setColor("Green")
        ],
        components: [button], ephemeral: true
      });
    } catch (error) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Se produjo un error al cambiar el avatar, asegúrese de que la URL sea válida.")
          .setColor("Red")
        ], ephemeral: true
      });
    }
  },
};