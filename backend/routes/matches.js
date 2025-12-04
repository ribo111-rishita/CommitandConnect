// backend/routes/matches.js
const express = require('express');
const auth = require('../middleware/authMiddleware');
const matchesController = require('../controllers/matchesController');

const router = express.Router();

router.post('/', auth, matchesController.createMatch);

router.get('/mentor', auth, matchesController.getRequestsForMentor);

router.get('/me', auth, matchesController.getRequestsForMentee);

module.exports = router;
