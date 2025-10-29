# OweSmart - Smart Debt Coaching & Financial Wellness App

A comprehensive debt coaching and financial wellness application with gamification, subscription tiers, and credit monitoring integration. Built with React and Node.js, using SQLite3 for data storage.

## 🎯 What is OweSmart?

OweSmart is a **debt coaching app** that consolidates all types of debt into a single intuitive dashboard, motivates users with gamified nudges, sends payment reminders, and provides credit reports from Credit Reporting Agencies (CRAs) for premium subscribers.

## 💎 Subscription Tiers

### OweSmart - RM 19.90/month (Individual Premium)
- Combine credit cards, personal loans, and BNPL debt into one dashboard
- Automatic recommendations for Avalanche or Snowball repayment strategies
- Visual progress trackers, milestone rewards, and personalized nudges
- AI-powered financial guidance

### OweSmarter - RM 99/month (Premium Plus)
- All OweSmart features
- Connect with CTOS and Experian for credit score monitoring
- Advanced "what-if" scenario analysis
- Dedicated customer support

### OweBigSmarts - RM 299/month (SMEs)
- All OweSmarter features
- Track business operating loans and personal credit lines
- AI analysis of business cycles for strategic recommendations
- Team access for finance teams and business partners
- Employee wellness program integration

## Features

- 📊 **Unified Dashboard** - Consolidate all debt types in one place
- � **Gamification** - Points, levels, streaks, achievements, and milestone rewards
- 🔔 **Smart Reminders** - Payment due date notifications and motivational nudges
- 🎯 **Debt Strategies** - Compare Avalanche vs Snowball methods
- 🤖 **AI Coaching** - Personalized debt payoff recommendations
- 📈 **Credit Monitoring** - CTOS/Experian integration (Premium+ tiers)
- 📱 **Mobile-First Design** - Dark theme with modern UI
- 🔐 **Secure Authentication** - JWT-based user authentication

## Tech Stack

### Backend
- Node.js + Express
- Sequelize ORM
- SQLite3 database
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Tailwind CSS (Dark theme)
- Axios for API calls

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Install backend dependencies:**
```bash
npm install
```

2. **Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

3. **Start the backend server:**
```bash
npm start
```
The backend will run on http://localhost:5000

4. **Start the frontend (in a new terminal):**
```bash
cd client
npm start
```
The frontend will run on http://localhost:3000

## Project Structure

```
OWESMART-ENT-1/
├── server/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   │   ├── authController.js
│   │   ├── debtController.js
│   │   ├── dashboardController.js
│   │   ├── consolidationController.js
│   │   ├── subscriptionController.js
│   │   ├── gamificationController.js
│   │   ├── reminderController.js
│   │   └── aiController.js
│   ├── middleware/      # Auth middleware
│   ├── models/          # Sequelize models
│   │   ├── User.js
│   │   ├── Debt.js
│   │   ├── Payment.js
│   │   ├── Subscription.js
│   │   ├── Gamification.js
│   │   ├── Reminder.js
│   │   └── CreditReport.js
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Express app entry
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Pricing.js
│   │   └── services/    # API service
│   └── public/
├── database/            # SQLite database file
└── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user (creates default OweSmart subscription)
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Dashboard
- GET `/api/dashboard/overview` - Get dashboard data with debt summary

### Debts
- GET `/api/debts` - Get all debts
- POST `/api/debts` - Create new debt
- GET `/api/debts/:id` - Get single debt
- PUT `/api/debts/:id` - Update debt
- DELETE `/api/debts/:id` - Delete debt

### Consolidation
- POST `/api/consolidation/calculate` - Calculate Avalanche/Snowball strategies
- GET `/api/consolidation/suggestion` - Get AI suggestion

### Subscription
- GET `/api/subscription` - Get user's subscription
- POST `/api/subscription` - Create/update subscription
- DELETE `/api/subscription` - Cancel subscription

### Gamification
- GET `/api/gamification` - Get gamification stats
- POST `/api/gamification/points` - Award points
- POST `/api/gamification/streak` - Update streak
- POST `/api/gamification/achievement` - Unlock achievement

### Reminders
- GET `/api/reminders` - Get all reminders
- POST `/api/reminders` - Create reminder
- POST `/api/reminders/generate` - Generate payment reminders
- PUT `/api/reminders/:id/sent` - Mark reminder as sent

### Payments
- POST `/api/payments` - Record payment
- GET `/api/payments` - Get all payments
- GET `/api/payments/debt/:debtId` - Get payments for debt

### AI
- POST `/api/ai/advice` - Get AI financial advice

## Database Schema

### Users
- id, name, email, password

### Debts
- id, userId, name, type, institution, amount, interestRate, minimumPayment, dueDate, priority, status

### Payments
- id, debtId, amount, paymentDate, type

### Subscriptions
- id, userId, tier, price, status, startDate, endDate, features

### Gamification
- id, userId, points, level, streak, achievements, milestones

### Reminders
- id, userId, debtId, type, message, scheduledFor, sent

### CreditReports
- id, userId, provider, score, reportData, fetchedAt

### FinancialProfile
- id, userId, monthlyIncome, monthlyExpenses, savingsGoal

## Usage

1. **Register** - Create account (starts with OweSmart tier)
2. **View Pricing** - Check subscription tiers at `/pricing`
3. **Add Debts** - Enter your debt information
4. **Dashboard** - See navy blue themed dashboard with debt overview
5. **Get AI Coaching** - Receive personalized debt payoff strategies
6. **Earn Rewards** - Complete milestones and earn gamification points
7. **Upgrade** - Switch to OweSmarter or OweBigSmarts for advanced features

## Features by Tier

| Feature | OweSmart | OweSmarter | OweBigSmarts |
|---------|----------|------------|--------------|
| Debt Dashboard | ✅ | ✅ | ✅ |
| AI Recommendations | ✅ | ✅ | ✅ |
| Gamification | ✅ | ✅ | ✅ |
| Debt Consolidation | ✅ | ✅ | ✅ |
| Credit Monitoring (CTOS/Experian) | ❌ | ✅ | ✅ |
| What-If Scenarios | ❌ | ✅ | ✅ |
| Business Loan Tracking | ❌ | ❌ | ✅ |
| Team Access | ❌ | ❌ | ✅ |
| Employee Wellness | ❌ | ❌ | ✅ |

## Development

To run in development mode with auto-reload:

Backend:
```bash
npm run dev
```

Frontend:
```bash
cd client
npm start
```

## License

MIT

## Author

BFM3130 - IT Project

