const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const generator = require('generate-password');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('password')
    .setDescription('Generar una contraseña segura'),
  category: "info",
  name: "password",
  execute: async (interaction, client) => {
    const code = generator.generate({
      length: 15,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true
    });
    await interaction.user.send({
      embeds: [new EmbedBuilder()
        .setDescription(`Aquí tienes la contraseña generada:\n\n ||${code}||`)
        .setColor("Green")
      ]
    })
    interaction.reply({
      embeds: [new EmbedBuilder()
        .setDescription("Se te ha enviado un mensaje directo con la contraseña generada.")
        .setColor("Green")
      ], ephemeral: true
    })
  },
};
