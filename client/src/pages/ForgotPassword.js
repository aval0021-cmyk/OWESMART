import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement password reset API call
      // await api.post('/auth/forgot-password', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Success Message */}
        <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Email Sent!</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We've sent a password reset link to<br />
                <strong className="text-gray-900">{email}</strong>
                <br /><br />
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 items-center justify-center p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10 text-white max-w-lg">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4">Password Recovery</h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Your account security is important to us. We'll help you get back on track.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Check Your Email</h3>
                  <p className="text-white/80 text-sm">Look for our password reset link in your inbox</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Create New Password</h3>
                  <p className="text-white/80 text-sm">Follow the link to set a secure new password</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Login Again</h3>
                  <p className="text-white/80 text-sm">Access your account with your new password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Form */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo/Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to login</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Forgot Password?</h1>
            <p className="text-gray-600 text-lg">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-gray-900 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Marketing/Visual */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white max-w-lg">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4">Secure Account Recovery</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Your financial data is always protected. We use industry-standard security to keep your account safe.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Bank-Level Security</h3>
                <p className="text-white/80 text-sm">Your data is encrypted end-to-end</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Quick Recovery</h3>
                <p className="text-white/80 text-sm">Get back to managing your debts in minutes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
                <p className="text-white/80 text-sm">Need help? Our team is always here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
