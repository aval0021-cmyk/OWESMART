import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AICoach from './pages/AICoach';
import TermsAndConditions from './pages/TermsAndConditions';
import HowItWorks from './pages/HowItWorks';
import PaymentPage from './pages/PaymentPage';
import FPXCheckout from './pages/FPXCheckout';
import PaymentResult from './pages/PaymentResult';
import AddDebt from './pages/AddDebt';
import Landing from './pages/Landing';
import GlobalLogo from './components/GlobalLogo';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <GlobalLogo />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-coach"
              element={
                <ProtectedRoute>
                  <AICoach />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-debt"
              element={
                <ProtectedRoute>
                  <AddDebt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fpx-checkout"
              element={
                <ProtectedRoute>
                  <FPXCheckout />
                </ProtectedRoute>
              }
            />
            <Route path="/payment/result" element={<PaymentResult />} />
            {/* Public landing is default */}
            <Route path="/" element={<Landing />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
