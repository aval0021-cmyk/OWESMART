# OweSmart - Smart Debt Coaching & Financial Wellness App

A comprehensive debt coaching and financial wellness application with **FPX payment gateway integration**, gamification, subscription tiers, AI coaching, and credit monitoring. Built with React and Node.js, using SQLite3 for data storage.

## 🎯 What is OweSmart?

OweSmart is a **debt coaching app** that consolidates all types of debt into a single intuitive dashboard, enables **direct debt payments via FPX online banking**, motivates users with gamified nudges, sends payment reminders, provides AI-powered financial coaching, and integrates with Credit Reporting Agencies (CRAs) for premium subscribers.

## 💎 Subscription Tiers

### OweSmart - RM 19.90/month (Individual Premium)
- ✅ Unified debt dashboard (all debt types)
- ✅ **FPX payment gateway** for direct debt payments
- ✅ Manual payment recording
- ✅ Automatic Avalanche/Snowball recommendations
- ✅ Visual progress trackers & milestone rewards
- ✅ Gamification (points, levels, achievements)
- ✅ AI-powered financial guidance
- ✅ Payment reminders & notifications

### OweSmarter - RM 99/month (Premium Plus)
- ✅ All OweSmart features
- ✅ CTOS & Experian credit score monitoring
- ✅ Advanced "what-if" scenario analysis
- ✅ Credit report insights
- ✅ Dedicated customer support
- ✅ Priority AI coaching

### OweBigSmarts - RM 299/month (SMEs & Enterprises)
- ✅ All OweSmarter features
- ✅ Business operating loan tracking
- ✅ AI analysis of business cycles
- ✅ Team access for finance teams
- ✅ Multi-user collaboration
- ✅ Employee wellness program integration
- ✅ Advanced analytics & reporting

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
- **Node.js + Express** - RESTful API server
- **Sequelize ORM** - Database management
- **SQLite3** - Lightweight database
- **JWT** - Authentication & authorization
- **bcryptjs** - Password hashing
- **FPX Integration** - Malaysia's national payment gateway
- **node-cron** - Scheduled tasks for reminders
- **Nodemailer** - Email notifications

### Frontend
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Context API** - State management
- **Firebase** - Google OAuth integration

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or yarn
- Modern web browser

### Installation & Setup

1. **Clone or download the project**

2. **Install backend dependencies:**
```bash
cd "OWESMART APP/OWESMART-ENT-1/OWESMART-ENT-1"
npm install
```

3. **Install frontend dependencies:**
```bash
cd client
npm install
cd ..
```

4. **Run database migrations** (if needed):
```bash
node server/migrations/add-debt-payment-fields.js
```

5. **Start the backend server:**
```bash
node server/server.js
```
✅ Backend will run on **http://localhost:5000**

6. **Start the frontend** (in a new terminal):
```bash
cd client
npm start
```
✅ Frontend will run on **http://localhost:3000**

7. **Access the application:**
   - Open your browser to **http://localhost:3000**
   - Register a new account or login
   - Start managing your debts!

### First-Time Setup

1. **Register** - Create your account (auto-enrolled in OweSmart tier)
2. **Add Debts** - Enter your debt information
3. **Explore Dashboard** - View your consolidated debt overview
4. **Make a Payment** - Try both manual recording and FPX demo mode
5. **Check AI Coach** - Get personalized financial advice
6. **Earn Points** - Complete actions to unlock achievements

## 📁 Project Structure

```
OWESMART-ENT-1/
├── server/
│   ├── config/
│   │   └── database.js              # SQLite configuration
│   ├── controllers/
│   │   ├── authController.js        # Authentication & user management
│   │   ├── debtController.js        # Debt CRUD operations
│   │   ├── paymentController.js     # Payment recording
│   │   ├── fpxController.js         # FPX payment gateway (NEW!)
│   │   ├── dashboardController.js   # Dashboard data aggregation
│   │   ├── consolidationController.js # Debt strategies
│   │   ├── subscriptionController.js # Subscription management
│   │   ├── gamificationController.js # Points & achievements
│   │   ├── reminderController.js    # Payment reminders
│   │   ├── notificationController.js # User notifications
│   │   └── aiController.js          # AI coaching
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication
│   ├── migrations/
│   │   ├── add-google-auth-fields.js
│   │   └── add-debt-payment-fields.js # Database migrations (NEW!)
│   ├── models/
│   │   ├── index.js                 # Model relationships
│   │   ├── User.js
│   │   ├── Debt.js                  # Updated with currentBalance
│   │   ├── Payment.js               # Updated with transactionId & status
│   │   ├── Subscription.js
│   │   ├── Gamification.js
│   │   ├── Reminder.js
│   │   ├── Notification.js
│   │   ├── ChatHistory.js
│   │   ├── CreditReport.js
│   │   └── FinancialProfile.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── debtRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── fpxRoutes.js             # FPX routes (NEW!)
│   │   ├── dashboardRoutes.js
│   │   ├── consolidationRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   ├── gamificationRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   ├── fpxService.js            # FPX integration (NEW!)
│   │   ├── aiService.js
│   │   ├── emailService.js
│   │   └── notificationScheduler.js
│   └── server.js                    # Express app entry
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.js
│   │   │   └── GlobalLogo.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ToastContext.js
│   │   ├── pages/
│   │   │   ├── Landing.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AddDebt.js
│   │   │   ├── PaymentPage.js       # Updated with payment method selection
│   │   │   ├── DebtPaymentCheckout.js # FPX bank selection (NEW!)
│   │   │   ├── DebtPaymentResult.js  # FPX payment result (NEW!)
│   │   │   ├── FPXCheckout.js       # Subscription payment
│   │   │   ├── PaymentResult.js     # Subscription result
│   │   │   ├── Pricing.js
│   │   │   ├── AICoach.js
│   │   │   ├── HowItWorks.js
│   │   │   ├── TermsAndConditions.js
│   │   │   ├── ForgotPassword.js
│   │   │   └── ResetPassword.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js                   # Main app with routing
│   │   ├── index.js
│   │   └── index.css                # Tailwind imports
│   ├── public/
│   │   ├── index.html
│   │   └── images/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── database/
│   └── owesmart.db                  # SQLite database file
├── OWESMART WEB/                    # Marketing website
├── package.json
├── README.md
├── DEBT_PAYMENT_GATEWAY_GUIDE.md   # FPX integration guide (NEW!)
├── FPX_INTEGRATION_GUIDE.md        # Original FPX guide
└── POC_COMPLETE_SUMMARY.md         # Project summary
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard data with debt summary

### Debts
- `GET /api/debts` - Get all debts
- `POST /api/debts` - Create new debt
- `GET /api/debts/:id` - Get single debt
- `PUT /api/debts/:id` - Update debt
- `DELETE /api/debts/:id` - Delete debt

### Payments
- `POST /api/payments` - Record manual payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/debt/:debtId` - Get payments for specific debt

### FPX Payment Gateway (NEW!)
- `GET /api/fpx/banks` - Get list of available banks
- `POST /api/fpx/debt/initiate` - Initiate FPX debt payment
- `POST /api/fpx/debt/callback` - FPX callback webhook
- `GET /api/fpx/debt/status/:orderId` - Check payment status
- `POST /api/fpx/debt/demo-callback/:orderId` - Demo mode payment simulation
- `POST /api/fpx/initiate` - Initiate subscription payment
- `POST /api/fpx/callback` - Subscription payment callback
- `GET /api/fpx/status/:orderId` - Check subscription payment status

### Consolidation & Strategies
- `POST /api/consolidation/calculate` - Calculate Avalanche/Snowball strategies
- `GET /api/consolidation/suggestion` - Get AI suggestion

### Subscription
- `GET /api/subscription` - Get user's subscription
- `POST /api/subscription` - Create/update subscription
- `DELETE /api/subscription` - Cancel subscription

### Gamification
- `GET /api/gamification` - Get gamification stats
- `POST /api/gamification/points` - Award points
- `POST /api/gamification/streak` - Update streak
- `POST /api/gamification/achievement` - Unlock achievement

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create reminder
- `POST /api/reminders/generate` - Generate payment reminders
- `PUT /api/reminders/:id/sent` - Mark reminder as sent

### AI Coach
- `POST /api/ai/advice` - Get AI financial advice
- `POST /api/ai/chat` - Chat with AI coach

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 📊 Database Schema

### Users
- `id`, `name`, `email`, `password`, `googleId`, `profilePicture`
- Manages user accounts and authentication

### Debts
- `id`, `userId`, `name`, `type`, `institution`, `amount`, **`currentBalance`**, `interestRate`, `minimumPayment`, `dueDate`, `priority`, `status`
- Tracks all user debts with real-time balance updates

### Payments
- `id`, `debtId`, `amount`, `paymentDate`, `type`, **`transactionId`**, **`status`**
- Records manual payments and FPX transactions

### Subscriptions
- `id`, `userId`, `tier`, `price`, `status`, `startDate`, `endDate`, `features`, `paymentMethod`, `transactionId`
- Manages subscription tiers and billing

### Gamification
- `id`, `userId`, `points`, `level`, `streak`, `achievements`, `milestones`
- Tracks user progress and rewards

### Reminders
- `id`, `userId`, `debtId`, `type`, `message`, `scheduledFor`, `sent`
- Automated payment reminders

### Notifications
- `id`, `userId`, `type`, `title`, `message`, `read`, `actionUrl`
- In-app notifications

### ChatHistory
- `id`, `userId`, `role`, `content`
- AI coach conversation history

### CreditReports
- `id`, `userId`, `provider`, `score`, `reportData`, `fetchedAt`
- Credit score monitoring (Premium tiers)

### FinancialProfile
- `id`, `userId`, `monthlyIncome`, `monthlyExpenses`, `savingsGoal`
- User financial data for AI recommendations

## 💳 FPX Payment Gateway

### Supported Banks (17 Malaysian Banks)
- Maybank, CIMB Bank, Public Bank, RHB Bank
- Hong Leong Bank, AmBank, UOB Bank
- Bank Islam, HSBC Bank, Bank Muamalat
- Affin Bank, Alliance Bank, BSN
- Standard Chartered, OCBC Bank
- Kuwait Finance House, Bank Rakyat

### Payment Features
- ✅ **Dual Mode**: Manual recording OR direct FPX payment
- ✅ **Demo Mode**: Test payments without real transactions
- ✅ **Secure**: FPX checksum validation
- ✅ **Real-time**: Instant balance updates
- ✅ **Tracking**: Complete transaction history
- ✅ **Rewards**: Earn 20 points per FPX payment

### How to Use
1. Navigate to **Payment** page
2. Select **"Pay via FPX"**
3. Choose debt and enter amount
4. Select your bank
5. Complete payment (demo mode for testing)
6. View success page with updated balance

### For Production
- Register with FPX for merchant account
- Update environment variables with production credentials
- Uncomment real FPX submission in `DebtPaymentCheckout.js`
- See `DEBT_PAYMENT_GATEWAY_GUIDE.md` for full setup

## 🎮 Gamification & Achievements

### Points System
- **+10 points** - Manual payment recording
- **+20 points** - FPX payment
- **+50 points** - First debt paid off
- **+100 points** - Subscription upgrade

### Achievements
- 🎯 First Payment
- 💳 FPX User
- 🎊 Debt Free
- 📈 Streak Master (7+ days)
- 🌟 Level Up

### Levels
- Level 1: 0-100 points
- Level 2: 101-300 points
- Level 3: 301-600 points
- Level 4: 601-1000 points
- Level 5: 1001+ points

## 🤖 AI Financial Coach

Get personalized advice powered by AI:
- Debt consolidation strategies
- Budget optimization tips
- Payment priority recommendations
- Financial wellness insights

Access via `/ai-coach` page

## Usage

## 🎯 User Journey

1. **Register/Login** - Create account or sign in with Google
2. **Add Debts** - Enter your debt information
3. **View Dashboard** - See consolidated debt overview with charts
4. **Make Payments** - Choose manual recording or FPX payment
5. **Get AI Coaching** - Receive personalized strategies
6. **Track Progress** - Monitor balance reduction and milestones
7. **Earn Rewards** - Complete actions to level up
8. **Upgrade Subscription** - Access premium features

## 📱 Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing homepage |
| Login | `/login` | User authentication |
| Register | `/register` | Account creation |
| Dashboard | `/dashboard` | Debt overview & charts |
| Add Debt | `/add-debt` | Create new debt entry |
| Payment | `/payment` | Manual or FPX payment |
| FPX Checkout | `/debt-payment-checkout` | Bank selection |
| Payment Result | `/debt-payment/result` | Payment confirmation |
| AI Coach | `/ai-coach` | AI financial guidance |
| Pricing | `/pricing` | Subscription tiers |
| How It Works | `/how-it-works` | Feature explainer |
| Terms | `/terms` | Terms & conditions |

## 💡 Features by Tier

| Feature | OweSmart | OweSmarter | OweBigSmarts |
|---------|----------|------------|--------------|
| Debt Dashboard | ✅ | ✅ | ✅ |
| **FPX Payment Gateway** | ✅ | ✅ | ✅ |
| Manual Payment Recording | ✅ | ✅ | ✅ |
| AI Recommendations | ✅ | ✅ | ✅ |
| Gamification | ✅ | ✅ | ✅ |
| Payment Reminders | ✅ | ✅ | ✅ |
| Debt Consolidation | ✅ | ✅ | ✅ |
| Credit Monitoring | ❌ | ✅ | ✅ |
| What-If Scenarios | ❌ | ✅ | ✅ |
| Business Loan Tracking | ❌ | ❌ | ✅ |
| Team Access | ❌ | ❌ | ✅ |
| Employee Wellness | ❌ | ❌ | ✅ |

## 🛠️ Development

### Running in Development Mode

**Backend** (with auto-reload):
```bash
npm run dev
```

**Frontend** (hot reload):
```bash
cd client
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_PATH=./database/owesmart.db

# JWT
JWT_SECRET=your-secret-key-here

# FPX Configuration (Demo Mode)
FPX_MERCHANT_ID=TEST_MERCHANT_001
FPX_MERCHANT_KEY=test-secret-key-123
FPX_EXCHANGE_ID=EX00010
FPX_GATEWAY_URL=https://uat.mepsfpx.com.my/FPXMain/seller2DReceiver.jsp
FPX_CALLBACK_URL=http://localhost:5000/api/fpx/debt/callback
FPX_RETURN_URL=http://localhost:3000/debt-payment/result
FRONTEND_URL=http://localhost:3000

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Testing

**Test FPX Payment Flow:**
1. Add a test debt
2. Go to Payment page
3. Select "Pay via FPX"
4. Choose any bank (demo mode)
5. Complete payment
6. Verify balance update and points awarded

**Test API Endpoints:**
```bash
# Health check
curl http://localhost:5000/api/health

# Get banks list
curl http://localhost:5000/api/fpx/banks
```

## 📚 Documentation

- **`README.md`** - This file
- **`DEBT_PAYMENT_GATEWAY_GUIDE.md`** - Complete FPX integration guide
- **`FPX_INTEGRATION_GUIDE.md`** - Original subscription payment guide
- **`POC_COMPLETE_SUMMARY.md`** - Project proof-of-concept summary
- **`GETTING_STARTED.md`** - Quick start guide
- **`BUILD_COMPLETE.md`** - Build completion notes

## 🐛 Troubleshooting

### Cannot add debts
- Ensure backend is running on port 5000
- Check database migrations have been run
- Verify `currentBalance` column exists in debts table

### FPX payment stuck loading
- This is expected in demo mode without real FPX credentials
- Demo mode automatically redirects after 2 seconds
- Check console logs for demo mode messages

### Database errors
- Run migrations: `node server/migrations/add-debt-payment-fields.js`
- Delete `database/owesmart.db` to reset (will lose all data)
- Check file permissions on database directory

### Port already in use
- Kill existing Node processes: `taskkill /F /IM node.exe` (Windows)
- Or use different ports in environment variables

## 🚀 Deployment

### Backend Deployment
1. Set NODE_ENV to `production`
2. Update FPX URLs to production endpoints
3. Use secure JWT_SECRET
4. Configure production database
5. Set up SSL certificate for HTTPS
6. Enable CORS for frontend domain

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve from `client/build` directory
3. Update API URLs to production backend
4. Configure environment-specific settings

## 🤝 Contributing

This is an academic project for BFM3130 - IT Project.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**BFM3130 - IT Project Team**
- Academic Institution: [Your University]
- Course: BFM3130
- Year: 2025

## 🙏 Acknowledgments

- FPX (Financial Process Exchange) for payment gateway integration
- React & Node.js communities
- Tailwind CSS for styling framework
- All open-source contributors

## 📞 Support

For issues or questions:
1. Check documentation in `/docs` folder
2. Review existing issues on GitHub
3. Contact project team

---

**Built with ❤️ for financial wellness and debt freedom** 🎉

