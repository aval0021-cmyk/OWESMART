const fpxService = require('../services/fpxService');
const { User, Subscription } = require('../models');

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

module.exports = exports;
