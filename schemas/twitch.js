const mongoose = require('mongoose');


const Twitch = new mongoose.Schema({
  streamerName: String,
  lastAlertTimestamp: { type: Date, default: null },
});

module.exports = mongoose.model("Twitch", Twitch);