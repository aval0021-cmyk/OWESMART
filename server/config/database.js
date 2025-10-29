const { sequelize } = require('../models');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ SQLite database connected successfully');
    
    // Sync all models - use { force: false } to not drop existing tables
    // Use { alter: false } for production to avoid schema conflicts
    await sequelize.sync({ force: false, alter: false });
    console.log('✓ Database models synchronized');
  } catch (error) {
    console.error('✗ Unable to connect to database:', error);
    // Don't exit on sync errors - migration script will handle schema updates
    if (error.name === 'SequelizeDatabaseError' && error.parent?.code === 'SQLITE_ERROR') {
      console.log('ℹ️ Database schema may need migration - run migration script');
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
