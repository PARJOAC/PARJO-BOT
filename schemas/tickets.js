const mongoose = require('mongoose');

const Tickets = new mongoose.Schema({
    Guild: String,
    Category: String,
    Role: String,
    Channel: String,
    State: { type: String, default: "b" }
});

module.exports = mongoose.model("Tickets", Tickets);