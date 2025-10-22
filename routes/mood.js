const express = require('express');
const router = express.Router();
const moodController = require('../controller/moodController');
const auth = require('../middleware/auth');

router.post('/create', auth, moodController.createMood);
router.get('/user', auth, moodController.getUserMoods);
router.get('/insights', auth, moodController.getInsights);

module.exports = router;