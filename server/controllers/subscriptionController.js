const { Subscription, Gamification } = require('../models');

// Get user's subscription
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.userId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create or update subscription
exports.createSubscription = async (req, res) => {
  try {
    const { tier, price } = req.body;

    const features = getTierFeatures(tier);

    const [subscription, created] = await Subscription.findOrCreate({
      where: { userId: req.userId },
      defaults: {
        tier,
        price,
        features,
        status: 'active',
        startDate: new Date()
      }
    });

    if (!created) {
      await subscription.update({
        tier,
        price,
        features,
        status: 'active',
        startDate: new Date()
      });
    }

    // Create gamification profile if doesn't exist
    await Gamification.findOrCreate({
      where: { userId: req.userId },
      defaults: {
        points: 0,
        level: 1,
        streak: 0,
        achievements: [],
        milestones: {}
      }
    });

    res.json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get tier features
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

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.userId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    await subscription.update({
      status: 'cancelled',
      endDate: new Date()
    });

    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
