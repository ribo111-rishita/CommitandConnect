const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchRequest', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
  durationMinutes: { type: Number, default: 60 },
  locationUrl: { type: String, default: '' }, // e.g zoom link
  notes: { type: String, default: '' },
  status: { type: String, enum: ['scheduled','completed','cancelled'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
