// backend/models/Match.js
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  mentor: { type: mongoose.Types.ObjectId, ref: 'Mentor', required: true },
  mentee: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, default: '' },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);
