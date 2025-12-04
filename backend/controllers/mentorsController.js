// backend/controllers/mentorsController.js
const Mentor = require('../models/Mentor'); // adjust path if needed
const { v2: cloudinary } = require('cloudinary');
const DatauriParser = require('datauri/parser');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper: upload buffer (from multer) to cloudinary, returns secure_url or empty string
 */
async function uploadBufferToCloudinary(file) {
  if (!file || !file.buffer) return '';
  const parser = new DatauriParser();
  const ext = file.originalname.split('.').pop();
  const file64 = parser.format(`file.${ext}`, file.buffer);
  const res = await cloudinary.uploader.upload(file64.content, { folder: 'mentor_avatars', transformation: [{ width: 800, crop: 'limit' }] });
  return res.secure_url;
}

/**
 * GET /profiles
 * Query params: page, limit, q (search by name/expertise), expertise, year, availability
 */
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
      // text-like search over name/expertise/bio
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

/**
 * GET /profile/:id
 * id is the user id (or mentor id depending on your design). Here we try both.
 */
exports.getProfileByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    // try find by _id first, else by user field
    let mentor = await Mentor.findById(id).lean();
    if (!mentor) {
      mentor = await Mentor.findOne({ user: id }).lean();
    }
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });
    res.json(mentor);
  } catch (err) {
    console.error('getProfileByUserId error', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * POST /profile
 * auth required. Creates or updates profile for req.user._id
 * Accepts multipart/form-data with optional file field 'avatar'
 */
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, expertise, bio, persona, availability } = req.body;

    // If file present, upload to cloudinary
    let avatarUrl = undefined;
    if (req.file) {
      try {
        avatarUrl = await uploadBufferToCloudinary(req.file);
      } catch (uploadErr) {
        console.error('avatar upload failed', uploadErr);
        // don't fail whole request; log and continue without avatar
      }
    }

    // find existing
    let mentor = await Mentor.findOne({ user: userId });
    if (mentor) {
      // update permitted fields
      mentor.name = name ?? mentor.name;
      mentor.expertise = expertise ?? mentor.expertise;
      mentor.bio = bio ?? mentor.bio;
      mentor.persona = persona ?? mentor.persona;
      mentor.availability = availability ?? mentor.availability;
      if (avatarUrl) mentor.avatarUrl = avatarUrl;
      await mentor.save();
    } else {
      // create new profile
      mentor = await Mentor.create({
        user: userId,
        name: name || req.user.name || 'Unnamed Mentor',
        expertise: expertise || '',
        bio: bio || '',
        persona: persona || '',
        availability: availability || '',
        avatarUrl: avatarUrl || ''
      });
    }

    res.json(mentor);
  } catch (err) {
    console.error('createOrUpdateProfile error', err);
    res.status(500).json({ error: 'Failed to create or update profile' });
  }
};

/**
 * DELETE /profile/:id
 * auth required. Only owner (or admin — modify logic to add admin role) can delete.
 */
exports.deleteProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const mentor = await Mentor.findById(id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    // allow deletion only by owner
    if (String(mentor.user) !== String(userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Mentor.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteProfile error', err);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
};
