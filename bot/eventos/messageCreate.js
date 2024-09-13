const Spam = require("../../schemas/spam.js");
const { EmbedBuilder } = require('discord.js');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  let Estado_Spam = await Spam.findOne({ Guild: message.guild.id }).exec();
  if (Estado_Spam && Estado_Spam.State) {
    let palabras = Estado_Spam.Word;
    if (palabras) {
      let contenido = message.content.toLowerCase();
      for (const palabra of palabras) {
        if (contenido.includes(palabra.toLowerCase())) {
          try {
            await message.delete();
            message.channel.send({
              embeds: [new EmbedBuilder()
                .setDescription(message.author.user + '¡Escribiste un mensaje que contiene spam!')
                .setColor("Red")
              ]
            });
          } catch (error) {
            message.reply({
              embeds: [new EmbedBuilder()
                .setDescription('He detectado un mensaje de spam pero no he podido eliminarlo.')
                .setColor("Red")
              ]
            });
          }
          break;
        }
      }
    }
  }

  const RegMention = new RegExp(`^<@!?${client.user.id}>( |)$`);

  const respuestas = [
    `🤖 ¡Oh, parece que alguien me ha mencionado! Si necesitas ayuda para ejecutar mis comandos o si me mencionaste por accidente, no te preocupes, estoy aquí para asistirte.`,
    `👋 ¿Me mencionaron? ¡Aquí estoy para ayudarte! Si tienes preguntas sobre cómo usar mis comandos, estaré encantado de explicarte.`,
    `🌟 ¡Hola! Parece que he sido mencionado. Permíteme ofrecerte información útil sobre cómo interactuar conmigo y aprovechar al máximo mis funciones.`,
    `🔍 ¿Una mención para mí? ¡No hay problema! Si olvidaste mi prefijo, solo recuerda mencionarme y te proporcionaré toda la ayuda que necesitas.`,
    `🚀 ¡Saludos! Parece que has llamado mi atención con una mención. ¡No dudes en preguntar cualquier cosa relacionada con mis utilidades y características!`,
    `🔮 He detectado una mención hacia mí. ¿Necesitas asistencia? No dudes en preguntar sobre mis comandos y capacidades.`,
  ];

  if (message.content.match(RegMention)) {

    message.reply({
      embeds: [new EmbedBuilder()
        .setTitle("🤖 ¿Alguien me ha mencionado?")
        .setDescription(respuestas[Math.floor(Math.random() * respuestas.length)])
        .addFields(
          { name: "❓ El prefix para ejecutar todos mis comandos es:", value: "`/`" },
          { name: "❓ Para poder ver los comandos existentes, te recomiendo ejecutar:", value: "`/help`" }
        )
        .setColor("Green")
      ]
    });
  }

  /*
  let Nivel = await Niveles.findOne({ Guild: message.guild.id, Person: message.author.id }).exec();
  let Estado_Niveles = await Estado_Nivel.findOne({ Guild: message.guild.id }).exec();
  if (Estado_Niveles) {
    if (!Nivel) {
      Nivel = await new Niveles({ Guild: message.guild.id, Person: message.author.id, EXP: 0, Level: 1 });
      await Nivel.save();
    } else {
      await Nivel.updateOne({ EXP: Nivel.EXP + 2 });
    }
    let xp = Nivel.Level * 25;
    if (Nivel.EXP >= xp) {
      await Nivel.updateOne({ EXP: 0, Level: Nivel.Level + 1 });
      message.channel.send(`${message.author} has subido al nivel ${parseInt(Nivel.Level + 1)}`);
    }
  }
  */
};