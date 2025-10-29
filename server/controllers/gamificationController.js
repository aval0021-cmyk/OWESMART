const { Gamification, Payment } = require('../models');

// Get user's gamification data
exports.getGamification = async (req, res) => {
  try {
    const [gamification] = await Gamification.findOrCreate({
      where: { userId: req.userId },
      defaults: {
        points: 0,
        level: 1,
        streak: 0,
        achievements: [],
        milestones: {}
      }
    });

    res.json(gamification);
  } catch (error) {
    console.error('Get gamification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Award points for action
exports.awardPoints = async (req, res) => {
  try {
    const { action, points } = req.body;

    const gamification = await Gamification.findOne({
      where: { userId: req.userId }
    });

    if (!gamification) {
      return res.status(404).json({ message: 'Gamification profile not found' });
    }

    const newPoints = gamification.points + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    await gamification.update({
      points: newPoints,
      level: newLevel
    });

    res.json({
      message: `You earned ${points} points!`,
      gamification
    });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update streak
exports.updateStreak = async (req, res) => {
  try {
    const gamification = await Gamification.findOne({
      where: { userId: req.userId }
    });

    if (!gamification) {
      return res.status(404).json({ message: 'Gamification profile not found' });
    }

    await gamification.update({
      streak: gamification.streak + 1
    });

    res.json(gamification);
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unlock achievement
exports.unlockAchievement = async (req, res) => {
  try {
    const { achievementId } = req.body;

    const gamification = await Gamification.findOne({
      where: { userId: req.userId }
    });

    if (!gamification) {
      return res.status(404).json({ message: 'Gamification profile not found' });
    }

    const achievements = gamification.achievements || [];
    if (!achievements.includes(achievementId)) {
      achievements.push(achievementId);
      await gamification.update({ achievements });
    }

    res.json({
      message: 'Achievement unlocked!',
      gamification
    });
  } catch (error) {
    console.error('Unlock achievement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
