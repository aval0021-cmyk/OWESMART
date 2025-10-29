const { Debt } = require('../models');

// Calculate consolidation strategies
exports.calculateStrategies = async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.userId, status: 'Active' }
    });

    if (debts.length === 0) {
      return res.json({ message: 'No active debts found' });
    }

    const { extraPayment = 0 } = req.body;

    // Convert to plain objects with numbers
    const debtList = debts.map(d => ({
      id: d.id,
      name: d.name,
      institution: d.institution,
      amount: parseFloat(d.amount),
      interestRate: parseFloat(d.interestRate),
      minimumPayment: parseFloat(d.minimumPayment),
      priority: d.priority
    }));

    // Avalanche method (highest interest rate first)
    const avalancheStrategy = calculateAvalanche(debtList, parseFloat(extraPayment));

    // Snowball method (lowest balance first)
    const snowballStrategy = calculateSnowball(debtList, parseFloat(extraPayment));

    res.json({
      strategies: {
        avalanche: avalancheStrategy,
        snowball: snowballStrategy
      },
      recommendation: avalancheStrategy.totalInterest < snowballStrategy.totalInterest ? 'avalanche' : 'snowball'
    });
  } catch (error) {
    console.error('Calculate strategies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Avalanche calculation (highest interest first)
function calculateAvalanche(debts, extraPayment) {
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  return simulatePayoff(sortedDebts, extraPayment, 'Avalanche');
}

// Snowball calculation (lowest balance first)
function calculateSnowball(debts, extraPayment) {
  const sortedDebts = [...debts].sort((a, b) => a.amount - b.amount);
  return simulatePayoff(sortedDebts, extraPayment, 'Snowball');
}

// Simulate debt payoff
function simulatePayoff(debts, extraPayment, method) {
  let remainingDebts = debts.map(d => ({
    ...d,
    remainingBalance: d.amount,
    totalPaid: 0,
    totalInterest: 0
  }));

  let month = 0;
  let totalInterest = 0;
  const payoffOrder = [];

  while (remainingDebts.some(d => d.remainingBalance > 0) && month < 600) { // 50 years max
    month++;
    
    // Add interest to all debts
    remainingDebts.forEach(debt => {
      if (debt.remainingBalance > 0) {
        const monthlyInterest = (debt.remainingBalance * debt.interestRate) / 100 / 12;
        debt.remainingBalance += monthlyInterest;
        debt.totalInterest += monthlyInterest;
        totalInterest += monthlyInterest;
      }
    });

    // Make minimum payments on all debts
    let availableExtra = extraPayment;
    remainingDebts.forEach(debt => {
      if (debt.remainingBalance > 0) {
        const payment = Math.min(debt.minimumPayment, debt.remainingBalance);
        debt.remainingBalance -= payment;
        debt.totalPaid += payment;
      }
    });

    // Apply extra payment to first debt in priority
    if (availableExtra > 0) {
      const targetDebt = remainingDebts.find(d => d.remainingBalance > 0);
      if (targetDebt) {
        const extraApplied = Math.min(availableExtra, targetDebt.remainingBalance);
        targetDebt.remainingBalance -= extraApplied;
        targetDebt.totalPaid += extraApplied;
      }
    }

    // Track payoff order
    remainingDebts.forEach(debt => {
      if (debt.remainingBalance <= 0 && !payoffOrder.find(p => p.id === debt.id)) {
        payoffOrder.push({
          id: debt.id,
          name: debt.name,
          month: month,
          totalInterest: Math.round(debt.totalInterest * 100) / 100
        });
      }
    });
  }

  return {
    method,
    totalMonths: month,
    totalInterest: Math.round(totalInterest * 100) / 100,
    payoffOrder,
    monthlySavings: extraPayment > 0 ? Math.round((totalInterest / month) * 100) / 100 : 0
  };
}

// Get suggested strategy
exports.getSuggestedStrategy = async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.userId, status: 'Active' }
    });

    if (debts.length === 0) {
      return res.json({ 
        suggestion: 'No active debts found. Great job staying debt-free!' 
      });
    }

    // Find highest interest debt
    const highestInterestDebt = debts.reduce((max, debt) => 
      parseFloat(debt.interestRate) > parseFloat(max.interestRate) ? debt : max
    );

    const suggestedPayment = Math.round(parseFloat(highestInterestDebt.minimumPayment) * 1.5);
    const potentialSavings = Math.round(parseFloat(highestInterestDebt.amount) * parseFloat(highestInterestDebt.interestRate) / 100 * 0.3);

    res.json({
      suggestion: `Focus on ${highestInterestDebt.type} debt first using Avalanche method. Paying RM ${suggestedPayment} this month can save you RM ${potentialSavings} in interest.`,
      targetDebt: {
        id: highestInterestDebt.id,
        name: highestInterestDebt.name,
        institution: highestInterestDebt.institution,
        interestRate: parseFloat(highestInterestDebt.interestRate)
      },
      suggestedPayment,
      potentialSavings
    });
  } catch (error) {
    console.error('Get suggested strategy error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
