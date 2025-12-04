// backend/models/Mentor.js
const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: false }, // optional link to user
  name: { type: String, required: true },
  expertise: { type: String, default: "" },
  bio: { type: String, default: "" },
  persona: { type: String, default: "" }, // text describing role/personality for AI
  availability: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model('Mentor', MentorSchema);
