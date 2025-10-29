const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

class EmailService {
  // Send payment reminder
  async sendPaymentReminder(userEmail, userName, debtName, amount, daysUntilDue) {
    const subject = `💰 Payment Reminder: ${debtName} due ${daysUntilDue === 0 ? 'today' : `in ${daysUntilDue} days`}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #14b8a6; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payment Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>This is a friendly reminder that your payment for <strong>${debtName}</strong> is ${daysUntilDue === 0 ? 'due today' : `due in ${daysUntilDue} days`}.</p>
              
              <div class="highlight">
                RM ${amount}
              </div>
              
              <p>Making this payment on time will help you:</p>
              <ul>
                <li>✅ Maintain your payment streak</li>
                <li>✅ Avoid late fees</li>
                <li>✅ Keep your credit score healthy</li>
                <li>✅ Stay on track with your debt-free goal</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="http://localhost:3000/payment" class="cta-button">Record Payment</a>
              </p>
              
              <p>Keep up the great work! 💪</p>
              
              <p>Best regards,<br>The OweSmart Team</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you have an active OweSmart account.</p>
              <p>© 2025 OweSmart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  // Send milestone congratulations
  async sendMilestoneCongrats(userEmail, userName, milestoneType, details) {
    let subject, emoji, message;

    switch (milestoneType) {
      case '25_percent':
        subject = '🎉 You\'ve Paid Off 25% of Your Debt!';
        emoji = '🎯';
        message = 'You\'re a quarter of the way there! Keep going strong!';
        break;
      case '50_percent':
        subject = '🎊 Halfway There! 50% Debt Paid!';
        emoji = '🔥';
        message = 'You\'re halfway to financial freedom! Amazing progress!';
        break;
      case '75_percent':
        subject = '🌟 Three Quarters Done! 75% Debt Paid!';
        emoji = '💪';
        message = 'You\'re so close! Just 25% left to go!';
        break;
      case '100_percent':
        subject = '🏆 DEBT FREE! You Did It!';
        emoji = '🎉';
        message = 'Congratulations! You\'ve completely paid off your debt! You\'re officially debt-free!';
        break;
      default:
        subject = '🎉 Milestone Achieved!';
        emoji = '⭐';
        message = 'Great job on reaching this milestone!';
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .emoji { font-size: 60px; margin-bottom: 10px; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .stat-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">${emoji}</div>
              <h1>${subject}</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p style="font-size: 18px; font-weight: bold; color: #14b8a6;">${message}</p>
              
              ${details ? `
              <div class="stats">
                <div class="stat-item">
                  <span>Total Debt Originally:</span>
                  <strong>RM ${details.totalDebt}</strong>
                </div>
                <div class="stat-item">
                  <span>Amount Paid:</span>
                  <strong style="color: #14b8a6;">RM ${details.amountPaid}</strong>
                </div>
                <div class="stat-item">
                  <span>Remaining:</span>
                  <strong>RM ${details.remaining}</strong>
                </div>
              </div>
              ` : ''}
              
              <p>Your dedication to becoming debt-free is truly inspiring. Every payment brings you closer to financial freedom! 🚀</p>
              
              <p style="text-align: center;">
                <a href="http://localhost:3000/dashboard" class="cta-button">View Your Progress</a>
              </p>
              
              <p>Keep up the fantastic work!</p>
              
              <p>Cheers,<br>The OweSmart Team</p>
            </div>
            <div class="footer">
              <p>You're one step closer to financial freedom!</p>
              <p>© 2025 OweSmart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  // Send level up notification
  async sendLevelUp(userEmail, userName, newLevel, points) {
    const subject = `🎮 Level Up! You're Now Level ${newLevel}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .level-badge { font-size: 72px; font-weight: bold; background: white; color: #8b5cf6; width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 20px auto; border: 5px solid #ec4899; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .points { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 20px; font-weight: bold; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Level Up!</h1>
              <div class="level-badge">${newLevel}</div>
              <p style="font-size: 20px;">Congratulations ${userName}!</p>
            </div>
            <div class="content">
              <p>Awesome news! You've just reached <strong>Level ${newLevel}</strong>! 🎉</p>
              
              <div class="points">
                ⭐ ${points} Total Points
              </div>
              
              <p>Your consistent efforts in managing your debt are paying off. Keep it up!</p>
              
              <p><strong>What's next?</strong></p>
              <ul>
                <li>Continue making on-time payments</li>
                <li>Record all your payments to earn points</li>
                <li>Reach new milestones</li>
                <li>Unlock more achievements</li>
              </ul>
              
              <p>Every level brings you closer to mastering your finances! 💪</p>
              
              <p>Keep crushing it!<br>The OweSmart Team</p>
            </div>
            <div class="footer">
              <p>© 2025 OweSmart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  // Send streak achievement
  async sendStreakAchievement(userEmail, userName, streakDays) {
    const subject = `🔥 ${streakDays} Day Streak! You're On Fire!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .streak-number { font-size: 72px; font-weight: bold; margin: 20px 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div style="font-size: 60px;">🔥</div>
              <h1>Streak Achievement!</h1>
              <div class="streak-number">${streakDays} Days</div>
            </div>
            <div class="content">
              <p>Hey ${userName}!</p>
              <p style="font-size: 18px; color: #ef4444; font-weight: bold;">You're on a ${streakDays} day payment streak! 🔥</p>
              
              <p>Consistency is key to financial success, and you're proving it every day!</p>
              
              <p><strong>Keep your streak alive by:</strong></p>
              <ul>
                <li>Making payments on time</li>
                <li>Recording all payments in the app</li>
                <li>Staying engaged with your debt plan</li>
              </ul>
              
              <p>You're building incredible financial habits! 💪</p>
              
              <p>The OweSmart Team</p>
            </div>
            <div class="footer">
              <p>© 2025 OweSmart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  // Send welcome email
  async sendWelcomeEmail(userEmail, userName) {
    const subject = '🎉 Welcome to OweSmart!';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #14b8a6 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #14b8a6; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to OweSmart! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Welcome aboard! We're excited to help you on your journey to becoming debt-free. 💪</p>
              
              <h3>Here's what you can do with OweSmart:</h3>
              
              <div class="feature">
                <strong>📊 Track All Your Debts</strong><br>
                Consolidate credit cards, loans, and BNPL in one dashboard
              </div>
              
              <div class="feature">
                <strong>🤖 AI Debt Coach</strong><br>
                Get personalized strategies and 24/7 financial guidance
              </div>
              
              <div class="feature">
                <strong>🎮 Gamification</strong><br>
                Earn points, level up, and unlock achievements
              </div>
              
              <div class="feature">
                <strong>💰 Smart Strategies</strong><br>
                Choose Avalanche or Snowball method to pay off faster
              </div>
              
              <p style="text-align: center;">
                <a href="http://localhost:3000/dashboard" class="cta-button">Get Started</a>
              </p>
              
              <p>If you have any questions, our AI coach is here to help 24/7!</p>
              
              <p>To your financial freedom!<br>The OweSmart Team</p>
            </div>
            <div class="footer">
              <p>© 2025 OweSmart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail(userEmail, subject, html);
  }

  // Core email sending function
  async sendEmail(to, subject, html) {
    try {
      const info = await transporter.sendMail({
        from: `"OweSmart" <${EMAIL_CONFIG.auth.user}>`,
        to,
        subject,
        html
      });

      console.log(`✓ Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`✗ Failed to send email to ${to}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await transporter.verify();
      console.log('✓ Email server is ready');
      return true;
    } catch (error) {
      console.error('✗ Email server connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
