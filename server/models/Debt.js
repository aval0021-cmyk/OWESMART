const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Debt = sequelize.define('Debt', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false // e.g., 'Credit Card', 'Personal Loan', 'Auto Loan'
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false // e.g., 'Maybank', 'BNPL - Atome', 'CIMB'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    interestRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    minimumPayment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    dueDate: {
      type: DataTypes.INTEGER, // Day of month (1-31)
      allowNull: false
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'Medium' // 'High', 'Medium', 'Low'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active' // 'Active', 'Paid Off', 'Closed'
    }
  }, {
    timestamps: true,
    tableName: 'debts'
  });

  return Debt;
};
