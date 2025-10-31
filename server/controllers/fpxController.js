const fpxService = require('../services/fpxService');
const { User, Subscription, Debt, Payment } = require('../models');

// Get available banks
exports.getBanks = async (req, res) => {
  try {
    const { type } = req.query;
    const banks = fpxService.getBankList(type || 'B2C');
    res.json({ banks });
  } catch (error) {
    console.error('Get banks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { tier, price, bankCode, customerName, customerEmail } = req.body;
    const userId = req.userId;

    // Validate inputs
    if (!tier || !price || !bankCode || !customerName || !customerEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate order ID
    const orderId = fpxService.generateOrderId(userId, tier);

    // Create payment initiation data
    const paymentData = fpxService.initiatePayment({
      orderId,
      amount: price,
      customerName,
      customerEmail,
      bankCode,
      tier
    });

    // Store pending transaction in database (you might want to create a Transaction model)
    // For now, we'll just return the payment data
    
    res.json({
      success: true,
      orderId,
      transactionId: paymentData.transactionId,
      gatewayUrl: paymentData.gatewayUrl,
      formData: paymentData.formData,
      message: 'Payment initiated successfully'
    });
  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// FPX callback handler
exports.handleCallback = async (req, res) => {
  try {
    console.log('FPX Callback received:', req.body);

    // Process the callback
    const result = fpxService.processCallback(req.body);

    if (!result.isValid) {
      console.error('Invalid FPX callback checksum');
      return res.status(400).send('Invalid checksum');
    }

    // Extract order details from orderId
    // Format: ORD{userId}_{tier}_{timestamp}_{random}
    const orderParts = result.orderId.split('_');
    const userId = parseInt(orderParts[0].replace('ORD', ''));
    const tier = orderParts[1];

    if (result.isSuccess) {
      // Payment successful - activate subscription
      console.log(`Payment successful for user ${userId}, tier: ${tier}`);

      // Get tier price
      const tierPrices = {
        'OweSmart': 19.90,
        'OweSmarter': 99.00,
        'OweBigSmarts': 299.00
      };

      // Get tier features
      const features = getTierFeatures(tier);

      // Update or create subscription
      const [subscription, created] = await Subscription.findOrCreate({
        where: { userId },
        defaults: {
          tier,
          price: tierPrices[tier],
          features,
          status: 'active',
          startDate: new Date(),
          paymentMethod: 'FPX',
          lastPaymentDate: new Date(),
          transactionId: result.transactionId
        }
      });

      if (!created) {
        await subscription.update({
          tier,
          price: tierPrices[tier],
          features,
          status: 'active',
          startDate: new Date(),
          paymentMethod: 'FPX',
          lastPaymentDate: new Date(),
          transactionId: result.transactionId
        });
      }

      // Award gamification points for subscription
      const { Gamification } = require('../models');
      await Gamification.findOrCreate({
        where: { userId },
        defaults: {
          points: 100,
          level: 1,
          streak: 0,
          achievements: ['first_subscription'],
          milestones: { subscribed: new Date() }
        }
      });

      console.log(`Subscription activated for user ${userId}`);
    } else {
      console.log(`Payment failed for user ${userId}: ${result.statusMessage}`);
    }

    // Send response to FPX
    res.send('OK');
  } catch (error) {
    console.error('Callback handler error:', error);
    res.status(500).send('Error processing callback');
  }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    // Extract userId from orderId and verify it matches
    const orderParts = orderId.split('_');
    const orderUserId = parseInt(orderParts[0].replace('ORD', ''));

    if (orderUserId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if subscription was activated
    const subscription = await Subscription.findOne({
      where: { userId }
    });

    if (subscription && subscription.transactionId) {
      res.json({
        success: true,
        status: 'completed',
        subscription: {
          tier: subscription.tier,
          status: subscription.status,
          startDate: subscription.startDate
        }
      });
    } else {
      res.json({
        success: false,
        status: 'pending',
        message: 'Payment not yet confirmed'
      });
    }
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get tier features
function getTierFeatures(tier) {
  const features = {
    OweSmart: {
      dashboard: true,
      aiRecommendations: true,
      gamification: true,
      consolidation: true,
      creditReporting: false,
      whatIfScenarios: false,
      businessLoans: false,
      teamAccess: false
    },
    OweSmarter: {
      dashboard: true,
      aiRecommendations: true,
      gamification: true,
      consolidation: true,
      creditReporting: true,
      whatIfScenarios: true,
      businessLoans: false,
      teamAccess: false,
      dedicatedSupport: true
    },
    OweBigSmarts: {
      dashboard: true,
      aiRecommendations: true,
      gamification: true,
      consolidation: true,
      creditReporting: true,
      whatIfScenarios: true,
      businessLoans: true,
      teamAccess: true,
      dedicatedSupport: true,
      employeeWellness: true
    }
  };

  return features[tier] || features.OweSmart;
}

// Initiate debt payment
exports.initiateDebtPayment = async (req, res) => {
  try {
    const { debtId, amount, bankCode, customerName, customerEmail } = req.body;
    const userId = req.userId;

    // Validate inputs
    if (!debtId || !amount || !bankCode || !customerName || !customerEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify debt belongs to user
    const debt = await Debt.findOne({
      where: { id: debtId, userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    // Generate order ID
    const orderId = fpxService.generateDebtOrderId(userId, debtId);

    // Create payment initiation data
    const paymentData = fpxService.initiatePayment({
      orderId,
      amount,
      customerName,
      customerEmail,
      bankCode,
      productDesc: `Debt Payment - ${debt.name}`,
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/debt-payment/result?orderId=${orderId}`
    });

    res.json({
      success: true,
      orderId,
      transactionId: paymentData.transactionId,
      gatewayUrl: paymentData.gatewayUrl,
      formData: paymentData.formData,
      message: 'Debt payment initiated successfully'
    });
  } catch (error) {
    console.error('Initiate debt payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// FPX debt payment callback handler
exports.handleDebtCallback = async (req, res) => {
  try {
    console.log('FPX Debt Payment Callback received:', req.body);

    // Process the callback
    const result = fpxService.processCallback(req.body);

    if (!result.isValid) {
      console.error('Invalid FPX callback checksum');
      return res.status(400).send('Invalid checksum');
    }

    // Extract details from orderId
    // Format: DEBT{userId}_{debtId}_{timestamp}_{random}
    const orderParts = result.orderId.split('_');
    const userId = parseInt(orderParts[0].replace('DEBT', ''));
    const debtId = parseInt(orderParts[1]);

    if (result.isSuccess) {
      // Payment successful - record payment
      console.log(`Debt payment successful for user ${userId}, debt ${debtId}, amount: RM ${result.amount}`);

      // Get debt details
      const debt = await Debt.findOne({
        where: { id: debtId, userId }
      });

      if (debt) {
        // Create payment record
        await Payment.create({
          debtId,
          amount: parseFloat(result.amount),
          paymentDate: new Date(),
          type: 'FPX Payment',
          transactionId: result.transactionId,
          status: 'Completed'
        });

        // Update debt balance
        const currentBalance = debt.currentBalance || debt.amount;
        const newBalance = currentBalance - parseFloat(result.amount);
        
        await debt.update({
          currentBalance: newBalance,
          status: newBalance <= 0 ? 'Paid Off' : 'Active'
        });

        // Award gamification points
        const { Gamification } = require('../models');
        const [gamification] = await Gamification.findOrCreate({
          where: { userId },
          defaults: { points: 0, level: 1, streak: 0, achievements: [], milestones: {} }
        });

        await gamification.update({
          points: gamification.points + 20,
          achievements: [...new Set([...gamification.achievements, 'fpx_payment'])],
          milestones: { ...gamification.milestones, lastPayment: new Date() }
        });

        console.log(`Debt payment recorded successfully. New balance: RM ${newBalance}`);
      }
    } else {
      console.log(`Debt payment failed for user ${userId}, debt ${debtId}: ${result.statusMessage}`);
    }

    // Send response to FPX
    res.send('OK');
  } catch (error) {
    console.error('Debt callback handler error:', error);
    res.status(500).send('Error processing callback');
  }
};

// Check debt payment status
exports.checkDebtPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    // Extract userId and debtId from orderId and verify it matches
    const orderParts = orderId.split('_');
    const orderUserId = parseInt(orderParts[0].replace('DEBT', ''));
    const debtId = parseInt(orderParts[1]);

    if (orderUserId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // DEMO MODE: Check if this is a demo payment (status=00 from URL)
    // In demo mode, we create the payment record on the fly
    const debt = await Debt.findOne({
      where: { id: debtId, userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    // Check if payment was already recorded
    const existingPayment = await Payment.findOne({
      where: { 
        debtId,
        createdAt: {
          [require('sequelize').Op.gte]: new Date(Date.now() - 60000) // Within last minute
        }
      },
      order: [['createdAt', 'DESC']]
    });

    if (existingPayment) {
      // Payment exists, return it
      res.json({
        success: true,
        status: 'completed',
        payment: {
          amount: existingPayment.amount,
          date: existingPayment.paymentDate,
          transactionId: existingPayment.transactionId || orderId,
          debtName: debt.name,
          newBalance: debt.currentBalance || debt.amount
        }
      });
    } else {
      // DEMO: Create payment automatically (simulating FPX callback)
      // In production, this would only happen via the actual FPX callback
      
      // Get the payment amount from the most recent attempt
      // For demo, we'll need to store this or pass it differently
      res.json({
        success: false,
        status: 'pending',
        message: 'Payment being processed. Please wait...'
      });
    }
  } catch (error) {
    console.error('Check debt payment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DEMO: Simulate FPX callback for testing
exports.simulateDebtCallback = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount } = req.body;
    const userId = req.userId;

    console.log(`🎮 DEMO MODE: Simulating FPX callback for order ${orderId}`);

    // Extract details from orderId
    const orderParts = orderId.split('_');
    const orderUserId = parseInt(orderParts[0].replace('DEBT', ''));
    const debtId = parseInt(orderParts[1]);

    if (orderUserId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get debt details
    const debt = await Debt.findOne({
      where: { id: debtId, userId }
    });

    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }

    // Create payment record
    const payment = await Payment.create({
      debtId,
      amount: parseFloat(amount),
      paymentDate: new Date(),
      type: 'FPX Payment (Demo)',
      transactionId: `DEMO_${orderId}_${Date.now()}`,
      status: 'Completed'
    });

    // Update debt balance
    const currentBalance = debt.currentBalance || debt.amount;
    const newBalance = currentBalance - parseFloat(amount);
    
    await debt.update({
      currentBalance: newBalance,
      status: newBalance <= 0 ? 'Paid Off' : 'Active'
    });

    // Award gamification points
    const { Gamification } = require('../models');
    const [gamification] = await Gamification.findOrCreate({
      where: { userId },
      defaults: { points: 0, level: 1, streak: 0, achievements: [], milestones: {} }
    });

    await gamification.update({
      points: gamification.points + 20,
      achievements: [...new Set([...gamification.achievements, 'fpx_payment_demo'])],
      milestones: { ...gamification.milestones, lastPayment: new Date() }
    });

    console.log(`✅ DEMO: Payment recorded successfully. New balance: RM ${newBalance}`);

    res.json({
      success: true,
      message: 'Demo payment processed successfully',
      payment: {
        amount: payment.amount,
        date: payment.paymentDate,
        transactionId: payment.transactionId,
        debtName: debt.name,
        newBalance
      }
    });
  } catch (error) {
    console.error('Demo callback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = exports;
