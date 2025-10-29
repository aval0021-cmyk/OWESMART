const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/advice', aiController.getAdvice);
router.post('/chat', aiController.chat);
router.get('/chat/history', aiController.getChatHistory);

module.exports = router;
