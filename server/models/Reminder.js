const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reminder = sequelize.define('Reminder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    debtId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'debts',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false // 'payment_due', 'milestone', 'motivation', 'streak'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'reminders'
  });

  return Reminder;
};
