const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const notificationScheduler = require('./services/notificationScheduler');

const app = express();

// Middleware

app.use(cors({
  origin: 'http://localhost:3000',  // your React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Add error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize server
async function startServer() {
  try {
    // Connect to database first
    await connectDB();

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/debts', require('./routes/debtRoutes'));
    app.use('/api/dashboard', require('./routes/dashboardRoutes'));
    app.use('/api/consolidation', require('./routes/consolidationRoutes'));
    app.use('/api/payments', require('./routes/paymentRoutes'));
    app.use('/api/ai', require('./routes/aiRoutes'));
    app.use('/api/subscription', require('./routes/subscriptionRoutes'));
    app.use('/api/gamification', require('./routes/gamificationRoutes'));
    app.use('/api/reminders', require('./routes/reminderRoutes'));
    app.use('/api/fpx', require('./routes/fpxRoutes'));
    app.use('/api/notifications', require('./routes/notificationRoutes'));

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', message: 'OweSmart API is running' });
    });

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
      console.log(`✓ Local access: http://localhost:${PORT}`);
      console.log(`✓ Server is ready to accept connections`);
      
      // Test if server is actually listening
      console.log(`✓ Server address:`, server.address());
      
      // Start notification scheduler
      notificationScheduler.start();
    });

    server.on('error', (error) => {
      console.error('✗ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`✗ Port ${PORT} is already in use`);
      }
      process.exit(1);
    });

    server.on('listening', () => {
      console.log('✓ Server is now listening for connections');
      
      // Test internal request to verify server is working
      const http = require('http');
      setTimeout(() => {
        http.get('http://localhost:5000/api/health', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => console.log('✓ Internal health check successful:', data));
        }).on('error', (err) => {
          console.error('✗ Internal health check failed:', err.message);
        });
      }, 1000);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
