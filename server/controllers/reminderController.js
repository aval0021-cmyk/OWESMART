const { Reminder, Debt } = require('../models');

// Get user's reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { userId: req.userId },
      include: [{ model: Debt }],
      order: [['scheduledFor', 'ASC']]
    });

    res.json(reminders);
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create reminder
exports.createReminder = async (req, res) => {
  try {
    const { debtId, type, message, scheduledFor } = req.body;

    const reminder = await Reminder.create({
      userId: req.userId,
      debtId,
      type,
      message,
      scheduledFor
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark reminder as sent
exports.markSent = async (req, res) => {
  try {
    const { id } = req.params;

    const reminder = await Reminder.findOne({
      where: { id, userId: req.userId }
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await reminder.update({
      sent: true,
      sentAt: new Date()
    });

    res.json(reminder);
  } catch (error) {
    console.error('Mark sent error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate payment reminders for all debts
exports.generatePaymentReminders = async (req, res) => {
  try {
    const debts = await Debt.findAll({
      where: { userId: req.userId, status: 'Active' }
    });

    const reminders = [];
    const today = new Date();

    for (const debt of debts) {
      const dueDate = new Date();
      dueDate.setDate(debt.dueDate);
      
      if (dueDate < today) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      }

      // Reminder 3 days before
      const reminderDate = new Date(dueDate);
      reminderDate.setDate(reminderDate.getDate() - 3);

      const reminder = await Reminder.create({
        userId: req.userId,
        debtId: debt.id,
        type: 'payment_due',
        message: `Payment of RM ${debt.minimumPayment} for ${debt.name} is due in 3 days`,
        scheduledFor: reminderDate
      });

      reminders.push(reminder);
    }

    res.json({ message: `Created ${reminders.length} reminders`, reminders });
  } catch (error) {
    console.error('Generate reminders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
