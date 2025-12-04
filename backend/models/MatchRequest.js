const mongoose = require('mongoose');

const MatchRequestSchema = new mongoose.Schema({
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorProfile' },
  subject: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending','accepted','declined','cancelled'], default: 'pending' },
  score: { type: Number, default: 0 }, // optional: matching score at creation
  createdAt: { type: Date, default: Date.now },
  respondedAt: { type: Date }
});

module.exports = mongoose.model('MatchRequest', MatchRequestSchema);
