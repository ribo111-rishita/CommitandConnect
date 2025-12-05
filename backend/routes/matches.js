// backend/routes/matches.js
const express = require('express');
const auth = require('../middleware/authMiddleware');
const matchesController = require('../controllers/matchesController');

const router = express.Router();

// CREATE 2: Create match request
router.post('/', auth, matchesController.createMatch);

// READ 2: Get all matches for user
router.get('/', auth, matchesController.getMatches);

// UPDATE 2: Update match status
router.put('/:id', auth, matchesController.updateMatchStatus);

// DELETE 2: Delete match request
router.delete('/:id', auth, matchesController.deleteMatch);

module.exports = router;
