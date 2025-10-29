const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    tier: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'OweSmart' // 'OweSmart', 'OweSmarter', 'OweBigSmarts'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 19.90
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active' // 'active', 'expired', 'cancelled'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    features: {
      type: DataTypes.JSON, // Store tier features as JSON
      defaultValue: {}
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true // 'FPX', 'Stripe', 'Manual'
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'subscriptions'
  });

  return Subscription;
};
