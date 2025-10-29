const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CreditReport = sequelize.define('CreditReport', {
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
    provider: {
      type: DataTypes.STRING,
      allowNull: false // 'CTOS', 'Experian'
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reportData: {
      type: DataTypes.JSON, // Store full report data
      allowNull: true
    },
    fetchedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    tableName: 'credit_reports'
  });

  return CreditReport;
};
