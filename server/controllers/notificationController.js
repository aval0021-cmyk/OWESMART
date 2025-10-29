const { Notification, User } = require('../models');
const emailService = require('../services/emailService');

// Create notification helper
async function createNotification(userId, type, title, message, options = {}) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      icon: options.icon || null,
      actionUrl: options.actionUrl || null,
      metadata: options.metadata || null
    });

    // Send email if requested
    if (options.sendEmail) {
      const user = await User.findByPk(userId, { attributes: ['email', 'name'] });
      if (user) {
        let emailResult;
        
        switch (type) {
          case 'payment_reminder':
            emailResult = await emailService.sendPaymentReminder(
              user.email,
              user.name,
              options.metadata?.debtName || 'Your Debt',
              options.metadata?.amount || 0,
              options.metadata?.daysUntilDue || 3
            );
            break;
          
          case 'milestone':
            emailResult = await emailService.sendMilestoneCongrats(
              user.email,
              user.name,
              options.metadata?.milestoneType,
              options.metadata?.details
            );
            break;
          
          case 'level_up':
            emailResult = await emailService.sendLevelUp(
              user.email,
              user.name,
              options.metadata?.newLevel,
              options.metadata?.points
            );
            break;
          
          case 'streak':
            emailResult = await emailService.sendStreakAchievement(
              user.email,
              user.name,
              options.metadata?.streakDays
            );
            break;
          
          case 'welcome':
            emailResult = await emailService.sendWelcomeEmail(user.email, user.name);
            break;
        }

        if (emailResult && emailResult.success) {
          await notification.update({
            emailSent: true,
            emailSentAt: new Date()
          });
        }
      }
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Get user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const { limit = 20, unreadOnly = false } = req.query;

    const where = { userId: req.userId };
    if (unreadOnly === 'true') {
      where.read = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    // Count unread
    const unreadCount = await Notification.count({
      where: { userId: req.userId, read: false }
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId: req.userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({
      read: true,
      readAt: new Date()
    });

    res.json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { read: true, readAt: new Date() },
      { where: { userId: req.userId, read: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId: req.userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Test notification (for development)
exports.createTestNotification = async (req, res) => {
  try {
    const notification = await createNotification(
      req.userId,
      'achievement',
      '🎉 Test Notification',
      'This is a test notification to verify the system is working!',
      {
        icon: '🧪',
        actionUrl: '/dashboard',
        sendEmail: false
      }
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create test notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export the helper function
exports.createNotification = createNotification;

module.exports = exports;
