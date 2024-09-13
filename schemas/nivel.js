const mongoose = require('mongoose');

const Nivel = new mongoose.Schema({
  Guild: { type: String },
  State: { type: String, default: false }
});

module.exports = mongoose.model('Nivel', Nivel);