// backend/routes/mentors.js
const express = require('express');
const auth = require('../middleware/authMiddleware');
const mentorsController = require('../controllers/mentorsController');
const multer = require('multer');

const router = express.Router();

// multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// READ 1 (Private): Get own profile
router.get('/me', auth, mentorsController.getMyProfile);

// READ 1: Get all profiles
router.get('/', mentorsController.getAllProfiles);

// CREATE 1: Create profile
router.post('/', auth, upload.single('avatar'), mentorsController.createProfile);

// UPDATE 1: Update profile
router.put('/me', auth, upload.single('avatar'), mentorsController.updateProfile);

// DELETE 1: Delete profile
router.delete('/me', auth, mentorsController.deleteProfile);

module.exports = router;
