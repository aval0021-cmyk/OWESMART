const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', gamificationController.getGamification);
router.post('/points', gamificationController.awardPoints);
router.post('/streak', gamificationController.updateStreak);
router.post('/achievement', gamificationController.unlockAchievement);

module.exports = router;
