import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking'); // 'checking', 'success', 'failed', 'pending'
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get order ID from URL params (FPX returns this)
      const orderId = searchParams.get('fpx_sellerOrderNo');
      const debitAuthStatus = searchParams.get('fpx_debitAuthCodeStatus');

      // Check if payment was successful based on FPX response
      if (debitAuthStatus === '00') {
        // Success! Wait a moment for callback to process
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify subscription was activated
        const response = await axios.get('http://localhost:5000/api/subscription', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'active') {
          setStatus('success');
          setSubscription(response.data);
          setMessage('Payment successful! Your subscription has been activated.');
        } else {
          setStatus('pending');
          setMessage('Payment received. Your subscription is being activated...');
        }
      } else if (debitAuthStatus === '09') {
        setStatus('pending');
        setMessage('Payment is being processed. Please check back in a few minutes.');
      } else if (debitAuthStatus === '13') {
        setStatus('failed');
        setMessage('Payment was cancelled. No charges were made.');
      } else {
        setStatus('failed');
        setMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('failed');
      setMessage('Unable to verify payment status. Please contact support if you were charged.');
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold text-white mb-4">Verifying Payment...</h2>
            <p className="text-gray-400">Please wait while we confirm your payment</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Payment Successful! 🎉</h2>
            <p className="text-gray-400 mb-6">{message}</p>

            {subscription && (
              <div className="bg-slate-800 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white mb-4">Subscription Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-white font-semibold">{subscription.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-semibold">RM {subscription.price}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 font-semibold capitalize">
                      {subscription.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-600 shadow-lg hover:shadow-teal-500/50 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Payment Pending</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-600 shadow-lg transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={checkPaymentStatus}
                className="block mx-auto text-gray-400 hover:text-white transition-colors"
              >
                Check Status Again
              </button>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Payment Failed</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/pricing')}
                className="bg-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-600 shadow-lg transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="block mx-auto text-gray-400 hover:text-white transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {renderStatus()}

        {/* Help Text */}
        {status !== 'checking' && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Need help? Contact us at support@owesmart.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
