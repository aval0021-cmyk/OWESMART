/**
 * Migration: Add Google OAuth fields to Users table
 * Run this migration to add support for Google authentication
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add googleId column
    await queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Add photoURL column
    await queryInterface.addColumn('users', 'photoURL', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add authProvider column
    await queryInterface.addColumn('users', 'authProvider', {
      type: Sequelize.ENUM('local', 'google'),
      defaultValue: 'local'
    });

    // Add emailVerified column
    await queryInterface.addColumn('users', 'emailVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // Make password nullable (for Google OAuth users)
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    console.log('✅ Migration completed: Google OAuth fields added to users table');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns
    await queryInterface.removeColumn('users', 'googleId');
    await queryInterface.removeColumn('users', 'photoURL');
    await queryInterface.removeColumn('users', 'authProvider');
    await queryInterface.removeColumn('users', 'emailVerified');

    // Make password non-nullable again
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });

    console.log('✅ Rollback completed: Google OAuth fields removed from users table');
  }
};
