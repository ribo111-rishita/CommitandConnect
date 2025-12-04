// backend/routes/mentors.js
const express = require('express');
const auth = require('../middleware/authMiddleware');
const mentorsController = require('../controllers/mentorsController');
const multer = require('multer');

const router = express.Router();

// multer memory storage (we upload the buffer to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/profiles', mentorsController.getAllProfiles);           // public list with filters
router.get('/profile/:id', mentorsController.getProfileByUserId);    // public single profile
router.get('/me', auth, async (req, res) => res.json(req.user));     // current user

// create / update own profile -- accepts multipart/form-data with optional 'avatar' file
router.post('/profile', auth, upload.single('avatar'), mentorsController.createOrUpdateProfile);

router.delete('/profile/:id', auth, mentorsController.deleteProfile);  // delete (owner only)

module.exports = router;
