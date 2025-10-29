const { Debt, Payment } = require('../models');
const { Op } = require('sequelize');

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.userId, status: 'Active' },
      include: [{ model: Payment }]
    });

    // Calculate total debt
    const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);

    // Calculate total paid
    const totalPaid = debts.reduce((sum, debt) => {
      const debtPayments = debt.Payments.reduce((pSum, payment) => 
        pSum + parseFloat(payment.amount), 0
      );
      return sum + debtPayments;
    }, 0);

    // Find next payment
    const today = new Date();
    const currentDay = today.getDate();
    
    let nextPayment = null;
    let daysUntilPayment = Infinity;
    
    debts.forEach(debt => {
      let daysUntil;
      if (debt.dueDate >= currentDay) {
        daysUntil = debt.dueDate - currentDay;
      } else {
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, debt.dueDate);
        daysUntil = Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24));
      }
      
      if (daysUntil < daysUntilPayment) {
        daysUntilPayment = daysUntil;
        nextPayment = {
          amount: debt.minimumPayment,
          daysUntil: daysUntil,
          debtName: debt.name
        };
      }
    });

    // Calculate progress (percentage paid)
    const progress = totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0;

    // Format debts for active debts list
    const activeDebts = debts.map(debt => ({
      id: debt.id,
      name: debt.name,
      institution: debt.institution,
      amount: parseFloat(debt.amount),
      interestRate: parseFloat(debt.interestRate),
      priority: debt.priority,
      dueDate: debt.dueDate
    }));

    res.json({
      totalDebt: parseFloat(totalDebt.toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      nextPayment,
      progress,
      activeDebts,
      debtCount: debts.length
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
