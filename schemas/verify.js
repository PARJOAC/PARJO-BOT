const mongoose = require('mongoose');

const Verify = new mongoose.Schema({
    Guild: String,
    Channel: String,
    Role: String,
    State: { type: String, default: "b" }
});

module.exports = mongoose.model("Verify", Verify);