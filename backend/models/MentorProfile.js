// backend/models/MentorProfile.js
const mongoose = require('mongoose');

const MentorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],        // e.g. ["Node.js","React","Data Structures"]
  experienceYears: { type: Number, default: 0 },
  availability: {                     // simple availability model (days/time)
    days: [{ type: String }],         // e.g. ["Mon","Wed"]
    hours: { type: String },          // e.g. "18:00-20:00"
    timezone: { type: String, default: 'Asia/Kolkata' }
  },
  rating: { type: Number, default: 0 },
  location: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MentorProfile', MentorProfileSchema);
