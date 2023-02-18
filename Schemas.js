const { Schema, model } = require("mongoose");

const schema = new Schema({
guildID: { type: String, default: "" },
AllSafe: { type: Array, default: [""] },
ChannelSafe: { type: Array, default: [""] },
RolSafe: { type: Array, default: [""] },
ServerSafe:  { type: Array, default: [""] },
WebSafe:  { type: Array, default: [""] },
SagTikSafe: { type: Array, default: [""] },
});

module.exports = model("guard", schema);