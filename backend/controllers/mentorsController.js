// backend/controllers/mentorsController.js
const Mentor = require('../models/Mentor');
const { v2: cloudinary } = require('cloudinary');
const DatauriParser = require('datauri/parser');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper: upload buffer (from multer) to cloudinary
 */
async function uploadBufferToCloudinary(file) {
  if (!file || !file.buffer) return '';
  const parser = new DatauriParser();
  const ext = file.originalname.split('.').pop();
  const file64 = parser.format(`file.${ext}`, file.buffer);
  const res = await cloudinary.uploader.upload(file64.content, { folder: 'mentor_avatars', transformation: [{ width: 800, crop: 'limit' }] });
  return res.secure_url;
}

// READ 1 (Private): Get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const mentor = await Mentor.findOne({ user: userId });
    if (!mentor) return res.status(404).json({ error: 'Profile not found' });

    res.json(mentor);
  } catch (err) {
    console.error('getMyProfile error', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// READ 1: Get all profiles (with filtering)
exports.getAllProfiles = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '12', 10));
    const skip = (page - 1) * limit;

    const q = req.query.q ? req.query.q.trim() : '';
    const expertise = req.query.expertise;
    const availability = req.query.availability;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { expertise: new RegExp(q, 'i') },
        { bio: new RegExp(q, 'i') },
      ];
    }
    if (expertise) filter.expertise = new RegExp(expertise, 'i');
    if (availability) filter.availability = new RegExp(availability, 'i');

    const [total, data] = await Promise.all([
      Mentor.countDocuments(filter),
      Mentor.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));
    res.json({ data, meta: { page, limit, total, pages } });
  } catch (err) {
    console.error('getAllProfiles error', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
};

// CREATE 1: Create a new mentor profile
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Check if profile already exists
    const existing = await Mentor.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ error: 'Profile already exists. Use PUT to update.' });
    }

    const { name, expertise, bio, persona, availability } = req.body;

    let avatarUrl = '';
    if (req.file) {
      try {
        avatarUrl = await uploadBufferToCloudinary(req.file);
      } catch (uploadErr) {
        console.error('avatar upload failed', uploadErr);
      }
    }

    const mentor = await Mentor.create({
      user: userId,
      name: name || req.user.name || 'Unnamed Mentor',
      expertise: expertise || '',
      bio: bio || '',
      persona: persona || '',
      availability: availability || '',
      avatarUrl: avatarUrl
    });

    res.status(201).json(mentor);
  } catch (err) {
    console.error('createProfile error', err);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// UPDATE 1: Update existing mentor profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let mentor = await Mentor.findOne({ user: userId });
    if (!mentor) {
      return res.status(404).json({ error: 'Profile not found. Use POST to create.' });
    }

    const { name, expertise, bio, persona, availability } = req.body;

    if (req.file) {
      try {
        const url = await uploadBufferToCloudinary(req.file);
        if (url) mentor.avatarUrl = url;
      } catch (uploadErr) {
        console.error('avatar upload failed', uploadErr);
      }
    }

    if (name !== undefined) mentor.name = name;
    if (expertise !== undefined) mentor.expertise = expertise;
    if (bio !== undefined) mentor.bio = bio;
    if (persona !== undefined) mentor.persona = persona;
    if (availability !== undefined) mentor.availability = availability;

    await mentor.save();
    res.json(mentor);
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// DELETE 1: Delete mentor profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const mentor = await Mentor.findOne({ user: userId });
    if (!mentor) return res.status(404).json({ error: 'Mentor profile not found' });

    await Mentor.deleteOne({ _id: mentor._id });
    res.json({ success: true, message: 'Profile deleted' });
  } catch (err) {
    console.error('deleteProfile error', err);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};
