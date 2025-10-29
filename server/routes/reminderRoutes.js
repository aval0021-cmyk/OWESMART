const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.put('/:id/sent', reminderController.markSent);
router.post('/generate', reminderController.generatePaymentReminders);

module.exports = router;
