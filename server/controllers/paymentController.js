const { Payment, Debt } = require('../models');

// Record a payment
exports.createPayment = async (req, res) => {
  try {
    const { debtId, amount, paymentDate, type } = req.body;

    // Verify debt belongs to user
    const debt = await Debt.findOne({
      where: { id: debtId, userId: req.userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const payment = await Payment.create({
      debtId,
      amount,
      paymentDate: paymentDate || new Date(),
      type: type || 'Regular'
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payments for a debt
exports.getPaymentsByDebt = async (req, res) => {
  try {
    const { debtId } = req.params;

    // Verify debt belongs to user
    const debt = await Debt.findOne({
      where: { id: debtId, userId: req.userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    const payments = await Payment.findAll({
      where: { debtId },
      order: [['paymentDate', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payments for user
exports.getAllPayments = async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.userId }
    });

    const debtIds = debts.map(d => d.id);

    const payments = await Payment.findAll({
      where: { debtId: debtIds },
      include: [{ model: Debt, attributes: ['name', 'institution'] }],
      order: [['paymentDate', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
