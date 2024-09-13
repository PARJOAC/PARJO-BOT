const { SlashCommandBuilder } = require('discord.js');
const Spam = require('../../../schemas/spam.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Controla el servicio antispam')
    .addSubcommand(subcommand =>
      subcommand
        .setName('activar')
        .setDescription('Activa el antispam')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('desactivar')
        .setDescription('Desactiva el antispam')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('añadir')
        .setDescription('Añade una palabra a la lista de spam')
        .addStringOption(option =>
          option.setName('palabra')
            .setDescription('La palabra a añadir')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('eliminar')
        .setDescription('Elimina una palabra de la lista de spam')
        .addStringOption(option =>
          option.setName('palabra')
            .setDescription('La palabra a eliminar')
            .setRequired(true)
        )
    ),
  category: "systems",
  name: "spam",
  execute: async (interaction, client) => {
    const guildId = interaction.guildId;

    let spamRecord = await Spam.findOne({ guildId: guildId });

    if (!spamRecord) {
      spamRecord = new Spam({ guildId: guildId });
    }
    
    switch (interaction.options.getSubcommand()) {
      case 'activar':
        spamRecord.state = true;
        await spamRecord.save();
        await interaction.reply('¡Antispam activado!');
        break;

      case 'desactivar':
        spamRecord.state = false;
        await spamRecord.save();
        await interaction.reply('¡Antispam desactivado!');
        break;

      case 'añadir':
        const wordToAdd = interaction.options.getString('palabra');
        spamRecord.words.push(wordToAdd);
        await spamRecord.save();
        await interaction.reply(`¡Palabra "${wordToAdd}" añadida a la lista de spam!`);
        break;

      case 'eliminar':
        const wordToRemove = interaction.options.getString('palabra');
        spamRecord.words = spamRecord.words.filter(word => word !== wordToRemove);
        await spamRecord.save();
        await interaction.reply(`¡Palabra "${wordToRemove}" eliminada de la lista de spam!`);
        break;

      default:
        await interaction.reply('Comando no reconocido');
        break;
    }
  },
};
