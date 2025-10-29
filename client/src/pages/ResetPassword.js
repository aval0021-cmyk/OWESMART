import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!verificationCode) {
      setError('Please enter verification code');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password reset API call
      // await api.post('/auth/reset-password', { 
      //   token, 
      //   verificationCode, 
      //   newPassword 
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-gray-300 rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Reset Password</h1>
          <p className="text-gray-700 text-lg">
            Kindly set your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {/* Verification Code */}
          <div>
            <label className="block text-black text-xl font-bold mb-3">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-6 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-gray-400"
              placeholder="Enter"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-black text-xl font-bold mb-3">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-gray-400"
              placeholder="Enter"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-black text-xl font-bold mb-3">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white rounded-full text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-gray-400"
              placeholder="Enter"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition disabled:opacity-50 shadow-lg mt-8"
          >
            {loading ? 'Resetting...' : 'Confirm'}
          </button>
        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-6 flex items-center justify-center gap-3 text-black text-lg font-bold hover:text-gray-700 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
