const mongoose = require('mongoose');

const Spam = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  words: { type: [String], default: [] },
  state: { type: Boolean, default: false },
});

module.exports = mongoose.model('Spam', Spam);