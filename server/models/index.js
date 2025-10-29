const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database/owesmart.db'),
  logging: false
});

// Import models
const User = require('./User')(sequelize);
const Debt = require('./Debt')(sequelize);
const Payment = require('./Payment')(sequelize);
const FinancialProfile = require('./FinancialProfile')(sequelize);
const Subscription = require('./Subscription')(sequelize);
const Gamification = require('./Gamification')(sequelize);
const Reminder = require('./Reminder')(sequelize);
const CreditReport = require('./CreditReport')(sequelize);
const ChatHistory = require('./ChatHistory')(sequelize);
const Notification = require('./Notification')(sequelize);

// Define relationships
User.hasMany(Debt, { foreignKey: 'userId', onDelete: 'CASCADE' });
Debt.belongsTo(User, { foreignKey: 'userId' });

Debt.hasMany(Payment, { foreignKey: 'debtId', onDelete: 'CASCADE' });
Payment.belongsTo(Debt, { foreignKey: 'debtId' });

User.hasOne(FinancialProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
FinancialProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Gamification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Gamification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Reminder, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reminder.belongsTo(User, { foreignKey: 'userId' });

Debt.hasMany(Reminder, { foreignKey: 'debtId', onDelete: 'SET NULL' });
Reminder.belongsTo(Debt, { foreignKey: 'debtId' });

User.hasMany(CreditReport, { foreignKey: 'userId', onDelete: 'CASCADE' });
CreditReport.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ChatHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
ChatHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Debt,
  Payment,
  FinancialProfile,
  Subscription,
  Gamification,
  Reminder,
  CreditReport,
  ChatHistory,
  Notification
};
