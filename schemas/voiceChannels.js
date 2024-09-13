const mongoose = require('mongoose');

const voiceChannels = new mongoose.Schema({
    Guild: String,
    Channel: String,
});

module.exports = mongoose.model("voiceChannels", voiceChannels);