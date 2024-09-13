# djs-tts

djs-ttc est un package utilisable avec discord.js qui connecte et fait parler un bot en vocale.

## Installation

npm install djs-tts

## Example

```js
const { playTTS } = require("djs-tts");

playTTS({
    voiceChannel: voiceChannel, // <GuildChannel>.type === "VoiceChannel"
    text: text, // String
    guild: message.guild, // <Guild>
    language: language, // String, automatic : "en"
    logsChannel: logsChannel, // <GuildChannel> 
    executor: exectutor, // <GuildMember>
    personalLogs: personalLogs // String, options : { "[user]" => @member, [userTag] => username#0000, [userId] => 123456789012345678, [text] => text }
      });
```
```js
const { playTTS } = require("djs-tts");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.User,
    Partials.Message,
    Partials.GuildMember,
  ],
});

const token = "";
const prefix = "!";
const logsChannelId = "";

client.on("ready", async (client) => {
  console.log(client.user.tag + " is online !");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === "playtts") {
      const text = args.join(" ");
      const voiceChannel = message.member?.voice.channel;
      let logsChannel = client.channels.cache.get(logsChannelId);
  
      if (!voiceChannel) {
        return message.reply("You are not in a voice channel!");
      };
      if(!logsChannel){
        logsChannel = false;
      };
  
      playTTS({
        voiceChannel: voiceChannel,
        text: text,
        guild: message.guild,
        language: "en",
        logsChannel: logsChannel,
        personalLogs: "Executor : [userTag] ([userId])\nText : [text]",
        executor: message.author
      });
    };
});

client.login(token).catch(err => console.log(err));
```

## Auteur

duxio
