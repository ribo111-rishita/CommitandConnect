// backend/controllers/matchesController.js
const Match = require('../models/Match');      // ensure you have a Match model
const Mentor = require('../models/Mentor');    // optional, for populating mentor info
const User = require('../models/User');        // optional, for populating user info

// Create a match request (mentee sends to mentor)
exports.createMatch = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { mentorId, note } = req.body;
    if (!mentorId) return res.status(400).json({ error: 'mentorId required' });

    const match = await Match.create({ mentor: mentorId, mentee: userId, note: note || '' });
    return res.json(match);
  } catch (err) {
    console.error('createMatch error', err);
    return res.status(500).json({ error: 'Create match failed' });
  }
};

// Get incoming requests for the logged-in mentor
exports.getRequestsForMentor = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // find mentor profile linked to user (if applicable)
    const mentorProfile = await Mentor.findOne({ user: userId }).lean();
    const mentorId = mentorProfile ? mentorProfile._id : null;

    const filter = mentorId ? { mentor: mentorId } : { mentor: userId };
    const requests = await Match.find(filter)
      .sort({ createdAt: -1 })
      .populate('mentee', 'name email')
      .populate('mentor', 'name avatarUrl')
      .lean();

    return res.json(requests);
  } catch (err) {
    console.error('getRequestsForMentor error', err);
    return res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Get requests for the logged-in mentee (their own requests)
exports.getRequestsForMentee = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const requests = await Match.find({ mentee: userId })
      .sort({ createdAt: -1 })
      .populate('mentor', 'name avatarUrl')
      .lean();

    return res.json(requests);
  } catch (err) {
    console.error('getRequestsForMentee error', err);
    return res.status(500).json({ error: 'Failed to fetch your requests' });
  }
};

// Accept a match (mentor accepts)
exports.acceptMatch = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user && (req.user._id || req.user.id);
    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // ensure only mentor can accept
    const mentorProfile = await Mentor.findOne({ user: userId }).lean();
    const mentorId = mentorProfile ? String(mentorProfile._id) : String(userId);
    if (String(match.mentor) !== String(mentorId)) return res.status(403).json({ error: 'Forbidden' });

    match.status = 'accepted';
    await match.save();
    return res.json(match);
  } catch (err) {
    console.error('acceptMatch error', err);
    return res.status(500).json({ error: 'Accept failed' });
  }
};

// Reject a match (mentor rejects)
exports.rejectMatch = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user && (req.user._id || req.user.id);
    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const mentorProfile = await Mentor.findOne({ user: userId }).lean();
    const mentorId = mentorProfile ? String(mentorProfile._id) : String(userId);
    if (String(match.mentor) !== String(mentorId)) return res.status(403).json({ error: 'Forbidden' });

    match.status = 'rejected';
    await match.save();
    return res.json(match);
  } catch (err) {
    console.error('rejectMatch error', err);
    return res.status(500).json({ error: 'Reject failed' });
  }
};

// Delete/cancel a match (owner or mentee)
exports.deleteMatch = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user && (req.user._id || req.user.id);
    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // owner check: mentee who created or mentor owner can delete
    const isOwner = String(match.mentee) === String(userId) || String(match.mentor) === String(userId);
    if (!isOwner) return res.status(403).json({ error: 'Forbidden' });

    await Match.deleteOne({ _id: id });
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteMatch error', err);
    return res.status(500).json({ error: 'Delete failed' });
  }
};
