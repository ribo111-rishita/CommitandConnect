// backend/controllers/matchesController.js
const Match = require('../models/Match');
const Mentor = require('../models/Mentor');

// CREATE 2: Create a match request
exports.createMatch = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { mentorId, note } = req.body;
    if (!mentorId) return res.status(400).json({ error: 'mentorId required' });

    // Prevent duplicate active requests
    const existing = await Match.findOne({ mentor: mentorId, mentee: userId, status: 'pending' });
    if (existing) return res.status(400).json({ error: 'Pending request already exists' });

    const match = await Match.create({ mentor: mentorId, mentee: userId, note: note || '' });
    return res.status(201).json(match);
  } catch (err) {
    console.error('createMatch error', err);
    return res.status(500).json({ error: 'Create match failed' });
  }
};

// READ 2: Get all matches for the logged-in user (as mentor or mentee)
exports.getMatches = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Check if user is a mentor
    const mentorProfile = await Mentor.findOne({ user: userId }).lean();
    const mentorId = mentorProfile ? mentorProfile._id : null;

    // Find matches where user is mentee OR mentor
    const filter = {
      $or: [
        { mentee: userId },
        { mentor: mentorId }
      ]
    };

    // If mentorId is null, the second condition { mentor: null } might match nothing or garbage, 
    // but effectively it just finds where mentee is userId.
    // To be cleaner:
    const query = mentorId
      ? { $or: [{ mentee: userId }, { mentor: mentorId }] }
      : { mentee: userId };

    const matches = await Match.find(query)
      .sort({ createdAt: -1 })
      .populate('mentee', 'name email')
      .populate('mentor', 'name avatarUrl')
      .lean();

    return res.json(matches);
  } catch (err) {
    console.error('getMatches error', err);
    return res.status(500).json({ error: 'Failed to fetch matches' });
  }
};

// UPDATE 2: Update match status (accept/reject)
exports.updateMatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const userId = req.user && (req.user._id || req.user.id);

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // Only the mentor can accept/reject
    const mentorProfile = await Mentor.findOne({ user: userId }).lean();
    const mentorId = mentorProfile ? String(mentorProfile._id) : null;

    if (String(match.mentor) !== mentorId) {
      return res.status(403).json({ error: 'Forbidden: Only the mentor can update status' });
    }

    match.status = status;
    await match.save();
    return res.json(match);
  } catch (err) {
    console.error('updateMatchStatus error', err);
    return res.status(500).json({ error: 'Update failed' });
  }
};

// DELETE 2: Delete/Cancel a match
exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && (req.user._id || req.user.id);

    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // Owner check: Mentee can cancel, Mentor can delete
    // We need to check if the user is the mentee OR the mentor
    const mentorProfile = await Mentor.findOne({ user: userId }).lean();
    const mentorId = mentorProfile ? String(mentorProfile._id) : null;

    const isMentee = String(match.mentee) === String(userId);
    const isMentor = String(match.mentor) === mentorId;

    if (!isMentee && !isMentor) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Match.deleteOne({ _id: id });
    return res.json({ success: true, message: 'Match deleted' });
  } catch (err) {
    console.error('deleteMatch error', err);
    return res.status(500).json({ error: 'Delete failed' });
  }
};
