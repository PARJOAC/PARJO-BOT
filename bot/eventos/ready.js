const fetch = require('node-fetch');
const { google } = require('googleapis');
const Video = require('../../schemas/youtube.js');
const Twitch = require('../../schemas/twitch.js');
const { ActivityType, ChannelType, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const chalk = require("chalk");
const axios = require("axios");

const API_KEY = process.env.API_YOUTUBE;
const CHANNEL_ID = process.env.ID_CANAL_YOUTUBE;
const youtube = google.youtube({ version: 'v3', auth: API_KEY });

module.exports = async (client) => {

  client.user.setPresence({
    activities: [{
      name: `mejorar el servidor`,
      type: ActivityType.Competing
    }],
    status: 'online',
  });

  setInterval(() => checkNewVideos(client), 1 * 60 * 1000);
}


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