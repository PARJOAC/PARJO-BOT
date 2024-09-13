const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
  AudioPlayerStatus,
} = require('@discordjs/voice');

function playTTS(options) {
  try {
    let {
      voiceChannel,
      text,
      guild,
      language,
      executor,
      logsChannel,
      personalLogs
    } = options;
    if (!language) language = 'en';

    if (!voiceChannel || !text || !guild) {
      throw new Error('voiceChannel, text, and guild arguments are required.');
    }

    if (text.length > 256) throw new TypeError('The length of text must be 256 or shorter!');

    const url = `http://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(
      text
    )}&tl=${language}`;

    const resource = createAudioResource(url, {
      inlineVolume: true,
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    player.play(resource);
    connection.subscribe(player);

    if (logsChannel) {
      if (personalLogs) {
        logsChannel.send(personalLogs
          .replace("[user]", executor)
          .replace("[userTag]", executor.tag)
          .replace("[userId]", executor.id)
          .replace("[text]", text)
        )
      } else {
        logsChannel.send(`Text-to-Speech command executed by ${executor.tag}\ntext: ${text}`);
      }
    };

    connection.on('finish', () => {
      voiceChannel.leave();
      connection.destroy();
    });

    connection.on('error', (error) => {
      console.error(`An error occurred in the voice connection: ${error}`);
      voiceChannel.leave();
    });

    player.on('error', (error) => {
      console.error(`An error occurred in the audio player: ${error}`);
      voiceChannel.leave();
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  } catch (error) {
    console.error('An error occurred while playing the text to speech:', error);
    throw error;
  }
}

module.exports = {
  playTTS,
};