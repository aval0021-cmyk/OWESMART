const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', debtController.getAllDebts);
router.get('/:id', debtController.getDebt);
router.post('/', debtController.createDebt);
router.put('/:id', debtController.updateDebt);
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
