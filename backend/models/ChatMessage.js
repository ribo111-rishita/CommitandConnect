const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);

