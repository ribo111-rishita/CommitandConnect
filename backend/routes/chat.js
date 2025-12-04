const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  try {
    const { message, mentorId } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message received." });
    }

    // Simple fake AI response
    const reply = `Mentor (${mentorId}) says: "${message}" is a great question! Here's what I think...`;

    return res.json({ reply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    return res.status(500).json({ reply: "Server error." });
  }
});

module.exports = router;
