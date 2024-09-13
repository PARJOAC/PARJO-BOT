const fetch = require('node-fetch');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Ver información sobre los servidores de Minecraft")
    .addStringOption(option => option
      .setName("plataforma")
      .setDescription("JAVA / BEDROCK")
      .setRequired(true)
      .addChoices(
        { name: 'JAVA', value: 'java' },
        { name: 'BEDROCK', value: 'bedrock' }))
    .addStringOption(option => option
      .setName("ip")
      .setDescription("Escribe la IP del servidor")
      .setRequired(true)),
  category: "info",
  name: "server",
  execute: async (interaction, client) => {
    try {
      let plataforma = interaction.options.getString("plataforma");
      let ip = interaction.options.getString("ip");
      const response = await fetch(`https://api.mcstatus.io/v2/status/${plataforma}/${ip}`);
      const data = await response.json();
      const online = data.online ? "Online" : "Offline";
      const iconUrl = `https://api.mcstatus.io/v2/icon/${ip}`;

      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("Información de Servidores Minecraft")
          .setThumbnail(iconUrl)
          .addFields(
            { name: 'Estado:', value: online },
            { name: "IP:", value: data.host },
            { name: "Jugadores:", value: `[ ${data.players.online} / ${data.players.max} ]` },
            { name: "Descripción:", value: data.online ? data.motd.clean : "No data." }
          )
          .setColor("Green")
        ], ephemeral: true
      });
    } catch (error) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("Se produjo un error al buscar la información del servidor.")
          .setColor("Red")
        ], ephemeral: true
      });
    }
  }
};
