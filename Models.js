const { Schema, model } = require("mongoose");

const schema = new Schema({
guildID: { type: String, default: "" },
GüvenliRol: { type: Array, default: [""] },
});

module.exports = model("güvenlirol", schema);