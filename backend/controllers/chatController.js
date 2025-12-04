const ChatMessage = require("../models/ChatMessage");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const msg = await ChatMessage.create({
      sender: req.user.id,
      receiver: receiverId,
      message
    });

    res.json(msg);
  } catch (err) {
    console.error("SEND MSG ERROR", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await ChatMessage.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("GET MSG ERROR", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
