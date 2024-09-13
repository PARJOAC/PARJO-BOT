const mongoose = require('mongoose');

const Youtube = new mongoose.Schema({
  lastVideoId: { type: String },
});

module.exports = mongoose.model('Youtube', Youtube);