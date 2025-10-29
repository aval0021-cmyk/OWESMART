const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Gamification = sequelize.define('Gamification', {
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
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // Days in a row with payments
    },
    achievements: {
      type: DataTypes.JSON,
      defaultValue: [] // Array of achievement IDs
    },
    milestones: {
      type: DataTypes.JSON,
      defaultValue: {} // Milestone tracking
    }
  }, {
    timestamps: true,
    tableName: 'gamification'
  });

  return Gamification;
};
