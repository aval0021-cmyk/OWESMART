const express = require('express');
const router = express.Router();
const fpxController = require('../controllers/fpxController');
const auth = require('../middleware/auth');

// Get available banks
router.get('/banks', fpxController.getBanks);

// Initiate payment (protected)
router.post('/initiate', auth, fpxController.initiatePayment);

// FPX callback (no auth - called by FPX gateway)
router.post('/callback', fpxController.handleCallback);

// Check payment status (protected)
router.get('/status/:orderId', auth, fpxController.checkPaymentStatus);

module.exports = router;
