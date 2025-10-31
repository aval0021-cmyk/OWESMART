const { sequelize } = require('../models');

async function addCurrentBalanceColumn() {
  try {
    console.log('🔄 Starting migration: Add currentBalance and update Payment fields...');

    // Check if currentBalance column exists in debts table
    const [debtColumns] = await sequelize.query(`PRAGMA table_info(debts);`);
    const hasCurrentBalance = debtColumns.some(col => col.name === 'currentBalance');

    if (!hasCurrentBalance) {
      console.log('📝 Adding currentBalance column to debts table...');
      await sequelize.query(`
        ALTER TABLE debts ADD COLUMN currentBalance DECIMAL(10, 2);
      `);
      console.log('✅ currentBalance column added to debts table');
    } else {
      console.log('✓ currentBalance column already exists in debts table');
    }

    // Check if transactionId column exists in payments table
    const [paymentColumns] = await sequelize.query(`PRAGMA table_info(payments);`);
    const hasTransactionId = paymentColumns.some(col => col.name === 'transactionId');
    const hasStatus = paymentColumns.some(col => col.name === 'status');

    if (!hasTransactionId) {
      console.log('📝 Adding transactionId column to payments table...');
      await sequelize.query(`
        ALTER TABLE payments ADD COLUMN transactionId VARCHAR(255);
      `);
      console.log('✅ transactionId column added to payments table');
    } else {
      console.log('✓ transactionId column already exists in payments table');
    }

    if (!hasStatus) {
      console.log('📝 Adding status column to payments table...');
      await sequelize.query(`
        ALTER TABLE payments ADD COLUMN status VARCHAR(255) DEFAULT 'Completed';
      `);
      console.log('✅ status column added to payments table');
    } else {
      console.log('✓ status column already exists in payments table');
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addCurrentBalanceColumn();
