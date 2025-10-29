const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
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
    type: {
      type: DataTypes.STRING,
      allowNull: false 
      // Types: 'payment_reminder', 'milestone', 'achievement', 'level_up', 
      //        'streak', 'debt_paid', 'subscription', 'welcome'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true // emoji or icon name
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true // Link to relevant page (e.g., /dashboard, /payment)
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true // Additional data like debt info, achievement details
    },
    emailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailSentAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'notifications'
  });

  return Notification;
};
