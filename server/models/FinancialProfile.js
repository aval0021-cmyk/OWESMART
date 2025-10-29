const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FinancialProfile = sequelize.define('FinancialProfile', {
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
    monthlyIncome: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    monthlyExpenses: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    savingsGoal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  }, {
    timestamps: true,
    tableName: 'financial_profiles'
  });

  return FinancialProfile;
};
