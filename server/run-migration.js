/**
 * Manual migration runner script for SQLite
 * SQLite doesn't support ALTER TABLE the same way as other databases,
 * so we'll use raw SQL queries
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database is in the parent directory's database folder
const dbPath = path.join(__dirname, '..', 'database', 'owesmart.db');

async function runMigration() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Error connecting to database:', err);
      process.exit(1);
    }
  });

  console.log('🔄 Starting migration...');
  console.log('📁 Database:', dbPath);

  try {
    // Check if columns already exist
    await new Promise((resolve, reject) => {
      db.all("PRAGMA table_info(users)", (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const existingColumns = rows.map(row => row.name);
        console.log('📋 Existing columns:', existingColumns.join(', '));

        const newColumns = [
          { name: 'googleId', sql: 'ALTER TABLE users ADD COLUMN googleId TEXT' },
          { name: 'photoURL', sql: 'ALTER TABLE users ADD COLUMN photoURL TEXT' },
          { name: 'authProvider', sql: "ALTER TABLE users ADD COLUMN authProvider TEXT DEFAULT 'local'" },
          { name: 'emailVerified', sql: 'ALTER TABLE users ADD COLUMN emailVerified INTEGER DEFAULT 0' }
        ];

        let addedCount = 0;

        // Add columns one by one if they don't exist
        const addNextColumn = (index) => {
          if (index >= newColumns.length) {
            // After adding all columns, create unique index for googleId if it was added
            if (addedCount > 0 && !existingColumns.includes('googleId')) {
              console.log('🔑 Creating unique index for googleId...');
              db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_googleId ON users(googleId)', (err) => {
                if (err) {
                  console.error('⚠️ Warning: Could not create unique index:', err.message);
                } else {
                  console.log('✅ Unique index created for googleId');
                }
                finishMigration();
              });
            } else {
              finishMigration();
            }
            return;
          }

          const column = newColumns[index];
          if (existingColumns.includes(column.name)) {
            console.log(`⏭️ Column '${column.name}' already exists, skipping`);
            addNextColumn(index + 1);
          } else {
            console.log(`➕ Adding column '${column.name}'...`);
            db.run(column.sql, (err) => {
              if (err) {
                console.error(`❌ Error adding column '${column.name}':`, err);
                reject(err);
              } else {
                console.log(`✅ Column '${column.name}' added successfully`);
                addedCount++;
                addNextColumn(index + 1);
              }
            });
          }
        };

        const finishMigration = () => {
          if (addedCount > 0) {
            console.log(`✅ Added ${addedCount} new column(s)`);
          } else {
            console.log('ℹ️ All columns already exist, no migration needed');
          }
          resolve();
        };

        addNextColumn(0);
      });
    });

    console.log('🎉 Migration completed successfully!');
    db.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    db.close();
    process.exit(1);
  }
}

runMigration();
