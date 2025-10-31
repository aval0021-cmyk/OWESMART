import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const DebtPaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState('');

  const orderId = searchParams.get('orderId');
  const fpxStatus = searchParams.get('status');
  const demoAmount = searchParams.get('amount'); // For demo mode

  useEffect(() => {
    if (orderId) {
      // If status=00 and we have demo mode, trigger the demo callback first
      if (fpxStatus === '00' && demoAmount) {
        triggerDemoCallback();
      } else {
        checkPaymentStatus();
      }
    } else {
      setStatus('error');
      setError('No order ID provided');
    }
  }, [orderId]);

  const triggerDemoCallback = async () => {
    try {
      const token = localStorage.getItem('token');
      
      console.log('🎮 Triggering demo callback...');
      await axios.post(
        `http://localhost:5000/api/fpx/debt/demo-callback/${orderId}`,
        { amount: parseFloat(demoAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Wait a moment then check status
      setTimeout(checkPaymentStatus, 500);
    } catch (error) {
      console.error('Demo callback error:', error);
      // Still try to check status
      checkPaymentStatus();
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Poll for payment status (FPX callback might take a few seconds)
      let attempts = 0;
      const maxAttempts = 10;
      
      const pollStatus = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/fpx/debt/status/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            setStatus('success');
            setPaymentInfo(response.data.payment);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(pollStatus, 2000); // Check again in 2 seconds
          } else {
            setStatus('pending');
          }
        } catch (error) {
          if (attempts < maxAttempts && error.response?.status !== 404) {
            attempts++;
            setTimeout(pollStatus, 2000);
          } else {
            setStatus('error');
            setError('Failed to verify payment status');
          }
        }
      };

      pollStatus();
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
      setError('Failed to check payment status');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-black mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-green-600"
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
            <h1 className="text-3xl font-bold text-black mb-2">Payment Successful! 🎉</h1>
            <p className="text-gray-600">Your debt payment has been processed</p>
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mt-4">
              +20 Points Earned 🌟
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-black mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Debt:</span>
                <span className="text-black font-semibold">{paymentInfo?.debtName}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Amount Paid:</span>
                <span className="text-black font-semibold">RM {paymentInfo?.amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Date:</span>
                <span className="text-black font-semibold">
                  {new Date(paymentInfo?.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transaction ID:</span>
                <span className="text-black font-mono text-sm">{paymentInfo?.transactionId}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-black">New Balance:</span>
                  <span className="text-xl font-bold text-green-600">
                    RM {paymentInfo?.newBalance?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/payment')}
              className="w-full py-4 rounded-full bg-white text-blue-600 border-2 border-blue-600 font-semibold hover:bg-blue-50 transition-all"
            >
              Make Another Payment
            </button>
          </div>

          {/* Celebration Message */}
          {paymentInfo?.newBalance <= 0 && (
            <div className="mt-6 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-bold text-yellow-900 mb-2">🎊 Congratulations! 🎊</h3>
              <p className="text-yellow-800">
                You've paid off this debt completely! You're one step closer to financial freedom!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-yellow-600"
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
          <h1 className="text-3xl font-bold text-black mb-2">Payment Pending</h1>
          <p className="text-gray-600 mb-8">
            Your payment is being processed. This may take a few minutes.
          </p>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-6">
            <p className="text-gray-600 mb-4">
              Please check your dashboard in a few minutes to see if the payment has been processed.
            </p>
            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-red-600"
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
        <h1 className="text-3xl font-bold text-black mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          {error || 'There was an issue processing your payment'}
        </p>
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-6">
          <p className="text-gray-600 mb-4">
            Don't worry, you have not been charged. Please try again or contact support if the issue persists.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/payment')}
            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 rounded-full bg-white text-blue-600 border-2 border-blue-600 font-semibold hover:bg-blue-50 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebtPaymentResult;
