const express = require('express');
const router = express.Router();
const consolidationController = require('../controllers/consolidationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/calculate', consolidationController.calculateStrategies);
router.get('/suggestion', consolidationController.getSuggestedStrategy);

module.exports = router;
