const { Client, Collection, Partials, GatewayIntentBits } = require('discord.js');
const chalk = require("chalk");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ],
  shards: "auto",
  allowedMentions: { repliedUser: true },
});

client.slash = new Collection();
client.dataArray = [];

require("dotenv").config();

const KeepAlive = require("./inicializacion_eventos/server.js");
const Errores = require("./inicializacion_eventos/errores.js");
const Eventos = require("./inicializacion_eventos/eventos.js");
const Slash = require("./inicializacion_eventos/slashCommands.js");
const Mongo = require("./inicializacion_eventos/mongo.js");

(async () => {
  await client.login(process.env.BOT_TOKEN).then(console.log(chalk.bold.magenta(`Se ha iniciado sesión correctamente`)));
  await Errores();
  await Mongo();
  await Slash(client);
  await Eventos(client);
  await KeepAlive();
  client.on("ready", async(client) => {
    async function checkNewVideos(client) {
  try {
    const response = await youtube.channels.list({
      part: 'snippet,contentDetails',
      id: CHANNEL_ID,
    });

    const channel = response.data.items[0];
    if (!channel) {
      console.log('No se encontró el canal de YouTube.');
      return;
    }

    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const playlistItems = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 1,
    });

    const video = playlistItems.data.items[0];
    if (!video) {
      console.log('No se encontraron videos en el canal.');
      return;
    }

    const videoId = video.snippet.resourceId.videoId;

    const lastVideo = await Video.findOne({}).exec();
    const lastVideoId = lastVideo ? lastVideo.lastVideoId : null;

    if (videoId !== lastVideoId) {
      const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

      const channelIdToNotify = '1134282577025441832';
      const channelToNotify = client.channels.cache.get(channelIdToNotify);
      if (channelToNotify !== ChannelType.GuildText) {
        channelToNotify.send({
          embeds: [new EmbedBuilder()
            .setTitle(`¡PARJO ACABA DE SUBIR UN VÍDEO!`)
            .setURL(videoURL)
            .setDescription(`Título: **${video.snippet.title}**\n\nDescripción: **${video.snippet.description}**`)
            .setColor("Red")
          ]
        })
      }

      if (lastVideo) {
        lastVideo.lastVideoId = videoId;
        await lastVideo.save();
      } else {
        await Video.create({ lastVideoId: videoId });
      }
    }
  } catch (error) {
    console.log('Error al obtener videos del canal de YouTube:', error);
  }
}

  client.user.setPresence({
    activities: [{
      name: `mejorar el servidor`,
      type: ActivityType.Competing
    }],
    status: 'online',
  });

  setInterval(() => checkNewVideos(client), 1 * 60 * 1000);
  })
})();