# 🔐 Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for OweSmart.

---

## 📋 What's Been Implemented

### Backend Changes ✅
- **User Model Updated** (`server/models/User.js`)
  - Added `googleId` field (unique identifier from Google)
  - Added `photoURL` field (user's profile picture)
  - Added `authProvider` field (enum: 'local' or 'google')
  - Added `emailVerified` field (boolean)
  - Made `password` nullable (Google users don't have passwords)

- **Auth Controller Updated** (`server/controllers/authController.js`)
  - Added `googleAuth` function to handle Google OAuth
  - Automatically creates user profile, subscription, and gamification data
  - Links existing accounts if email matches
  - Generates JWT token for session management

- **Auth Routes Updated** (`server/routes/authRoutes.js`)
  - Added `POST /api/auth/google` endpoint

### Frontend Changes ✅
- **API Service Updated** (`client/src/services/api.js`)
  - Added `googleAuth` function to call backend

- **Auth Context Updated** (`client/src/context/AuthContext.js`)
  - Added `googleAuth` method for authentication flow
  - Manages token storage and user state

- **Login Page Updated** (`client/src/pages/Login.js`)
  - Integrated Firebase Google sign-in
  - Sends user data to backend
  - Validates Terms & Conditions agreement

- **Register Page Updated** (`client/src/pages/Register.js`)
  - Integrated Firebase Google sign-up
  - Sends user data to backend

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

First, we need to update your database to support Google authentication fields.

```powershell
cd server
node run-migration.js
```

**Expected Output:**
```
🔄 Starting migration...
📁 Database: ./database/owesmart.db
✅ Database connection established
✅ Migration completed: Google OAuth fields added to users table
🎉 Migration completed successfully!
```

If something goes wrong, you can rollback:
```powershell
node run-migration.js --rollback
```

---

### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **`owesmart`** (or your choice)
4. Click **Continue**
5. Disable Google Analytics (optional) or enable it
6. Click **Create project**
7. Wait for setup to complete (~30 seconds)
8. Click **Continue** when ready

---

### Step 3: Enable Google Authentication

1. In Firebase Console, click **"Authentication"** in left sidebar
2. Click **"Get started"** (if first time)
3. Go to **"Sign-in method"** tab
4. Find **"Google"** in the providers list
5. Click on **Google**
6. Toggle the **Enable** switch to ON
7. Select **Project support email** (your email address)
8. Click **Save**

---

### Step 4: Get Firebase Configuration

1. Click the **⚙️ Settings gear icon** in left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon `</>`** to add a web app
5. Enter app nickname: **`owesmart-web`**
6. ✅ Check **"Also set up Firebase Hosting"** (optional)
7. Click **"Register app"**
8. You'll see your Firebase configuration object

---

### Step 5: Update Firebase Config File

Copy your Firebase configuration and paste it into:
**`client/src/config/firebase.js`**

Replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // YOUR ACTUAL API KEY
  authDomain: "owesmart-xxxxx.firebaseapp.com", // YOUR AUTH DOMAIN
  projectId: "owesmart-xxxxx", // YOUR PROJECT ID
  storageBucket: "owesmart-xxxxx.appspot.com", // YOUR STORAGE BUCKET
  messagingSenderId: "123456789012", // YOUR MESSAGING SENDER ID
  appId: "1:123456789012:web:xxxxxxxxxxxxx" // YOUR APP ID
};
```

**Save the file** after updating.

---

### Step 6: Restart Your Servers

If your servers are already running, restart them to apply changes:

**Backend Server:**
```powershell
# Terminal 1 - In server directory
cd server
node server.js
```

**Frontend Server:**
```powershell
# Terminal 2 - In client directory
cd client
npm start
```

---

## 🧪 Testing Google Authentication

### Test Login Flow

1. Open your browser to http://localhost:3000/login
2. Check **"I agree to Terms & Conditions"**
3. Click **"Continue with Google"**
4. A Google sign-in popup should appear
5. Select your Google account
6. You should be redirected to `/dashboard`
7. Check browser console for any errors

### Test Register Flow

1. Open your browser to http://localhost:3000/register
2. Click **"Sign up with Google"**
3. Select your Google account
4. You should be redirected to `/dashboard`
5. A new account should be created in your database

### Verify Backend

Check your backend terminal for logs:
```
Google auth successful for: your.email@gmail.com
User created/updated with Google ID: 1234567890
```

### Check Database

You can verify the user was created:
```powershell
cd server
sqlite3 database/owesmart.db
```

```sql
SELECT id, name, email, googleId, authProvider, emailVerified FROM users WHERE authProvider = 'google';
```

Type `.quit` to exit SQLite.

---

## 🔍 Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Make sure you've replaced the placeholder values in `firebase.js` with your actual Firebase credentials.

### Issue: "Network request failed"
**Solution:** Make sure your backend server is running on port 5000.

### Issue: "User already exists"
**Solution:** This is normal if you're testing with the same Google account. The backend will link the Google account to the existing user.

### Issue: Migration fails
**Solution:** Check if your database file exists at `server/database/owesmart.db`. If not, the server needs to run once to create it.

### Issue: Google popup doesn't appear
**Solution:** 
- Check browser console for errors
- Make sure popup blockers are disabled
- Clear browser cache and try again

### Issue: CORS errors
**Solution:** Backend already has CORS enabled. Make sure both servers are running.

---

## 📊 Authentication Flow Diagram

```
┌─────────────┐
│   User      │
│  Clicks     │
│  Google     │
│   Button    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Firebase Authentication (Frontend) │
│  - Opens Google sign-in popup       │
│  - User selects Google account      │
│  - Returns user data (uid, email)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend (Login.js / Register.js)  │
│  - Receives Firebase user data      │
│  - Calls googleAuth() from Context  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Backend API (POST /api/auth/google)│
│  - Receives: uid, email, name       │
│  - Checks if user exists            │
│  - Creates/updates user in database │
│  - Creates profile & subscription   │
│  - Generates JWT token              │
│  - Returns: token + user data       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Frontend (AuthContext)             │
│  - Stores token in localStorage     │
│  - Updates user state               │
│  - Navigates to /dashboard          │
└─────────────────────────────────────┘
```

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

✅ No errors in browser console  
✅ No errors in backend terminal  
✅ Google popup appears and closes  
✅ Toast notification: "Welcome back, [Your Name]! 🎉"  
✅ Redirected to dashboard  
✅ User appears in database with `authProvider = 'google'`  
✅ JWT token stored in localStorage  

---

## 🔐 Security Notes

- Firebase handles all OAuth security automatically
- JWT tokens expire after 7 days
- Passwords are not stored for Google users
- Email verification status is preserved from Google
- Google IDs are unique and cannot be changed

---

## 📚 API Reference

### POST /api/auth/google

**Request Body:**
```json
{
  "uid": "google-user-id-123456",
  "email": "user@gmail.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "emailVerified": true
}
```

**Response (200 OK):**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@gmail.com",
    "photoURL": "https://...",
    "authProvider": "google"
  }
}
```

**Error Responses:**
- `400` - Missing required fields (uid or email)
- `500` - Server error

---

## 🎯 Next Steps After Setup

Once Google authentication is working:

1. **Test thoroughly** - Try signing in/up with different Google accounts
2. **Check dashboard** - Ensure user data loads correctly
3. **Verify subscriptions** - Check that default subscription was created
4. **Test logout** - Make sure logout works and clears session
5. **Mobile testing** - Test on your phone (after fixing network access)

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check backend terminal for error logs
4. Verify all files were saved correctly
5. Ensure Firebase credentials are correct

---

**Last Updated:** October 29, 2025  
**Version:** 1.0
