const cron = require('node-cron');
const { Debt, User, Payment, Gamification } = require('../models');
const { createNotification } = require('../controllers/notificationController');
const { Op } = require('sequelize');

class NotificationScheduler {
  // Start all scheduled tasks
  start() {
    console.log('📅 Starting notification scheduler...');

    // Check for payment reminders every day at 9 AM
    cron.schedule('0 9 * * *', () => {
      this.checkPaymentReminders();
    });

    // Check for milestones every hour
    cron.schedule('0 * * * *', () => {
      this.checkMilestones();
    });

    // Check for streak maintenance every day at 8 PM
    cron.schedule('0 20 * * *', () => {
      this.checkStreaks();
    });

    console.log('✓ Notification scheduler started');
  }

  // Check and send payment reminders
  async checkPaymentReminders() {
    try {
      console.log('🔔 Checking payment reminders...');

      const today = new Date();
      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      // Get all active debts
      const debts = await Debt.findAll({
        where: { status: 'Active' },
        include: [{ model: User, attributes: ['id', 'name', 'email'] }]
      });

      let remindersSent = 0;

      for (const debt of debts) {
        // Calculate next due date
        const dueDate = debt.dueDate; // Day of month (1-31)
        const nextDueDate = new Date();
        nextDueDate.setDate(dueDate);
        
        // If the due date this month has passed, use next month
        if (nextDueDate < today) {
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }

        // Calculate days until due
        const daysUntilDue = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));

        // Send reminder 3 days before
        if (daysUntilDue === 3) {
          await createNotification(
            debt.userId,
            'payment_reminder',
            `💰 Payment Due in 3 Days`,
            `Your payment of RM ${debt.minimumPayment} for ${debt.name} is due in 3 days`,
            {
              icon: '💰',
              actionUrl: '/payment',
              sendEmail: true,
              metadata: {
                debtId: debt.id,
                debtName: debt.name,
                amount: debt.minimumPayment,
                daysUntilDue: 3
              }
            }
          );
          remindersSent++;
        }
        // Send reminder on due date
        else if (daysUntilDue === 0) {
          await createNotification(
            debt.userId,
            'payment_reminder',
            `⚠️ Payment Due Today`,
            `Your payment of RM ${debt.minimumPayment} for ${debt.name} is due today`,
            {
              icon: '⚠️',
              actionUrl: '/payment',
              sendEmail: true,
              metadata: {
                debtId: debt.id,
                debtName: debt.name,
                amount: debt.minimumPayment,
                daysUntilDue: 0
              }
            }
          );
          remindersSent++;
        }
      }

      console.log(`✓ Sent ${remindersSent} payment reminders`);
    } catch (error) {
      console.error('Error checking payment reminders:', error);
    }
  }

  // Check and celebrate milestones
  async checkMilestones() {
    try {
      console.log('🎯 Checking milestones...');

      const users = await User.findAll({
        attributes: ['id', 'name', 'email']
      });

      let milestonesSent = 0;

      for (const user of users) {
        // Get all debts for user
        const debts = await Debt.findAll({
          where: { userId: user.id },
          include: [{ model: Payment }]
        });

        if (debts.length === 0) continue;

        // Calculate total debt and total paid
        const totalDebt = debts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
        const totalPaid = debts.reduce((sum, debt) => {
          const debtPayments = debt.Payments.reduce((pSum, payment) => 
            pSum + parseFloat(payment.amount), 0
          );
          return sum + debtPayments;
        }, 0);

        const percentagePaid = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;
        const remaining = totalDebt - totalPaid;

        // Check for milestone achievements (25%, 50%, 75%, 100%)
        if (percentagePaid >= 25 && percentagePaid < 30) {
          await createNotification(
            user.id,
            'milestone',
            '🎯 25% Debt Paid!',
            `Congratulations! You've paid off 25% of your total debt!`,
            {
              icon: '🎯',
              actionUrl: '/dashboard',
              sendEmail: true,
              metadata: {
                milestoneType: '25_percent',
                details: {
                  totalDebt: totalDebt.toFixed(2),
                  amountPaid: totalPaid.toFixed(2),
                  remaining: remaining.toFixed(2)
                }
              }
            }
          );
          milestonesSent++;
        } else if (percentagePaid >= 50 && percentagePaid < 55) {
          await createNotification(
            user.id,
            'milestone',
            '🎊 Halfway There! 50% Paid!',
            `Amazing progress! You've paid off half of your debt!`,
            {
              icon: '🔥',
              actionUrl: '/dashboard',
              sendEmail: true,
              metadata: {
                milestoneType: '50_percent',
                details: {
                  totalDebt: totalDebt.toFixed(2),
                  amountPaid: totalPaid.toFixed(2),
                  remaining: remaining.toFixed(2)
                }
              }
            }
          );
          milestonesSent++;
        } else if (percentagePaid >= 75 && percentagePaid < 80) {
          await createNotification(
            user.id,
            'milestone',
            '🌟 75% Complete!',
            `You're so close! Only 25% left to go!`,
            {
              icon: '💪',
              actionUrl: '/dashboard',
              sendEmail: true,
              metadata: {
                milestoneType: '75_percent',
                details: {
                  totalDebt: totalDebt.toFixed(2),
                  amountPaid: totalPaid.toFixed(2),
                  remaining: remaining.toFixed(2)
                }
              }
            }
          );
          milestonesSent++;
        } else if (percentagePaid >= 100) {
          await createNotification(
            user.id,
            'milestone',
            '🏆 DEBT FREE!',
            `Congratulations! You're officially debt-free! 🎉`,
            {
              icon: '🎉',
              actionUrl: '/dashboard',
              sendEmail: true,
              metadata: {
                milestoneType: '100_percent',
                details: {
                  totalDebt: totalDebt.toFixed(2),
                  amountPaid: totalPaid.toFixed(2),
                  remaining: '0.00'
                }
              }
            }
          );
          milestonesSent++;
        }
      }

      console.log(`✓ Sent ${milestonesSent} milestone notifications`);
    } catch (error) {
      console.error('Error checking milestones:', error);
    }
  }

  // Check and celebrate streaks
  async checkStreaks() {
    try {
      console.log('🔥 Checking streaks...');

      const gamifications = await Gamification.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'email'] }]
      });

      let streaksSent = 0;

      for (const gam of gamifications) {
        const streakDays = gam.streak;

        // Celebrate significant streaks
        if (streakDays === 7 || streakDays === 30 || streakDays === 100 || 
            streakDays === 365 || (streakDays > 0 && streakDays % 100 === 0)) {
          
          await createNotification(
            gam.userId,
            'streak',
            `🔥 ${streakDays} Day Streak!`,
            `You're on fire! ${streakDays} consecutive days of staying on track!`,
            {
              icon: '🔥',
              actionUrl: '/dashboard',
              sendEmail: streakDays >= 30, // Only email for 30+ day milestones
              metadata: {
                streakDays
              }
            }
          );
          streaksSent++;
        }
      }

      console.log(`✓ Sent ${streaksSent} streak notifications`);
    } catch (error) {
      console.error('Error checking streaks:', error);
    }
  }

  // Trigger notification on level up (called from gamification controller)
  async notifyLevelUp(userId, newLevel, points) {
    try {
      await createNotification(
        userId,
        'level_up',
        `🎮 Level Up! Now Level ${newLevel}`,
        `Congratulations! You've reached Level ${newLevel} with ${points} points!`,
        {
          icon: '🎮',
          actionUrl: '/dashboard',
          sendEmail: true,
          metadata: {
            newLevel,
            points
          }
        }
      );
    } catch (error) {
      console.error('Error sending level up notification:', error);
    }
  }

  // Trigger notification on debt paid off
  async notifyDebtPaidOff(userId, debtName, totalAmount) {
    try {
      await createNotification(
        userId,
        'debt_paid',
        `🎉 ${debtName} Paid Off!`,
        `Congratulations! You've completely paid off ${debtName} (RM ${totalAmount})!`,
        {
          icon: '🎉',
          actionUrl: '/dashboard',
          sendEmail: true,
          metadata: {
            debtName,
            totalAmount
          }
        }
      );
    } catch (error) {
      console.error('Error sending debt paid off notification:', error);
    }
  }
}

module.exports = new NotificationScheduler();
