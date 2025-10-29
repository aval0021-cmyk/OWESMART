const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/debt/:debtId', paymentController.getPaymentsByDebt);

module.exports = router;
