const { Schema, model } = require("mongoose");

const schema = new Schema({
guildID: { type: String, default: "" },
RolKoruma: { type: Number, default: 0 },
KanalKoruma: { type: Number, default: 0 },
SunucuKoruma: { type: Number, default: 0 },
WebKoruma:  { type: Number, default: 0 },
SagTikKoruma: { type: Number, default: 0 },
});

module.exports = model("guardayar", schema);