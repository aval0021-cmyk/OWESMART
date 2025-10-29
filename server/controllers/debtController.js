const { Debt, Payment } = require('../models');
const { Op } = require('sequelize');

// Get all debts for user
exports.getAllDebts = async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.userId },
      include: [{ model: Payment }],
      order: [['createdAt', 'DESC']]
    });

    res.json(debts);
  } catch (error) {
    console.error('Get debts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single debt
exports.getDebt = async (req, res) => {
  try {
    const debt = await Debt.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [{ model: Payment }]
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    res.json(debt);
  } catch (error) {
    console.error('Get debt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new debt
exports.createDebt = async (req, res) => {
  try {
    const { name, type, institution, amount, interestRate, minimumPayment, dueDate, priority } = req.body;

    const debt = await Debt.create({
      userId: req.userId,
      name,
      type,
      institution,
      amount,
      interestRate,
      minimumPayment,
      dueDate,
      priority: priority || 'Medium',
      status: 'Active'
    });

    res.status(201).json(debt);
  } catch (error) {
    console.error('Create debt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update debt
exports.updateDebt = async (req, res) => {
  try {
    const debt = await Debt.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    await debt.update(req.body);
    res.json(debt);
  } catch (error) {
    console.error('Update debt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete debt
exports.deleteDebt = async (req, res) => {
  try {
    const debt = await Debt.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    await debt.destroy();
    res.json({ message: 'Debt deleted successfully' });
  } catch (error) {
    console.error('Delete debt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
