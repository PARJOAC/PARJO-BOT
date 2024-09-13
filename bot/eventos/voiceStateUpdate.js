const { ChannelType } = require('discord.js');
const voiceSchema = require("../../schemas/voice.js");
const channelSchema = require("../../schemas/voiceChannels.js");
const channelTimers = {};

module.exports = async (client, oldState, newState) => {
    if (oldState.channelId === newState.channelId) {
        if (oldState.serverDeaf === false && newState.selfDeaf === true) return;
        if (oldState.serverDeaf === true && newState.selfDeaf === false) return;
        if (oldState.serverMute === false && newState.serverMute === true) return;
        if (oldState.serverMute === true && newState.serverMute === false) return;
        if (oldState.selfDeaf === false && newState.selfDeaf === true) return;
        if (oldState.selfDeaf === true && newState.selfDeaf === false) return;
        if (oldState.selfMute === false && newState.selfMute === true) return;
        if (oldState.selfMute === true && newState.selfMute === false) return;
        if (oldState.selfVideo === false && newState.selfVideo === true) return;
        if (oldState.selfVideo === true && newState.selfVideo === false) return;
        if (oldState.streaming === false && newState.streaming === true) return;
        if (oldState.streaming === true && newState.streaming === false) return;
        return;
    }

    const guildID = newState.guild.id || oldState.guild.id;
    const data = await voiceSchema.findOne({ Guild: guildID });

    if (data && newState.channelId === data.Channel) {
        const user = await client.users.fetch(newState.id);
        const member = newState.guild.members.cache.get(user.id);

        if (data.ChannelCount) {
            data.ChannelCount += 1;
            await data.save();
        } else {
            data.ChannelCount = 1;
            await data.save();
        }

        let channelName = data.ChannelName;
        channelName = channelName.replace(`{emoji}`, "🔊");
        channelName = channelName.replace(`{channel name}`, `Voz ${data.ChannelCount}`);
        channelName = channelName.replace(`{channel count}`, `${data.ChannelCount}`);
        channelName = channelName.replace(`{member}`, `Canal ${user.username}`);
        channelName = channelName.replace(`{member tag}`, `${user.tag}`);

        const channel = await newState.guild.channels.create({
            name: "⌛",
            type: ChannelType.GuildVoice,
            parent: data.Category,
        });

        if (member.voice.setChannel(channel)) {
            await channel.edit({ name: channelName });
        }

        new channelSchema({
            Guild: guildID,
            Channel: channel.id,
        }).save();
        channelTimers[channel.id] = setInterval(() => {
            const voiceChannel = newState.guild.channels.cache.get(channel.id);
            if (voiceChannel && voiceChannel.members.size === 0) {

                voiceChannel.delete()
                delete channelTimers[channel.id];
            }
        }, 2000);
    }
};
