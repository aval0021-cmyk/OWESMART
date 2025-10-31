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

// Debt Payment Routes
// Initiate debt payment (protected)
router.post('/debt/initiate', auth, fpxController.initiateDebtPayment);

// FPX debt payment callback (no auth - called by FPX gateway)
router.post('/debt/callback', fpxController.handleDebtCallback);

// Check debt payment status (protected)
router.get('/debt/status/:orderId', auth, fpxController.checkDebtPaymentStatus);

// DEMO: Simulate FPX callback for testing (protected)
router.post('/debt/demo-callback/:orderId', auth, fpxController.simulateDebtCallback);

module.exports = router;
