const mongoose = require('mongoose');

const Mute = new mongoose.Schema({
  Guild: { type: String },
  Rol: { type: String }
});

module.exports = mongoose.model('Mute', Mute);