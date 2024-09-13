const mongoose = require("mongoose");

const Despedida = new mongoose.Schema({
  Guild: { type: String, required: true, unique: true },
  Channel: { type: String },
  State: { type: String, default: "b" },
});

module.exports = mongoose.model("Despedida", Despedida);