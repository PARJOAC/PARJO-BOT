const { playTTS } = require("djs-tts");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tts")
    .setDescription("Texto a Voz")
    .addStringOption(option => option
      .setName("decir")
      .setDescription("Lo que quieres que diga el voz")
      .setRequired(true)),
  category: "info",
  name: "tts",
  execute: async (interaction, client) => {
    const text = interaction.options.getString("decir");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setDescription("¡No estás en un canal de voz!")
          .setColor("Red")
        ], ephemeral: true
      });

      playTTS({
        voiceChannel: voiceChannel,
        text: text,
        guild: interaction.guild,
        language: "es",
        executor: interaction.user
      });
    }
  }
}