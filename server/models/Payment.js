const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    debtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'debts',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'Regular' // 'Regular', 'Extra', 'Final'
    }
  }, {
    timestamps: true,
    tableName: 'payments'
  });

  return Payment;
};
