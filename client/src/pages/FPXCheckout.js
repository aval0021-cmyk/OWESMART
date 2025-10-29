import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const FPXCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Get plan details from location state
  const { tier, price, planName } = location.state || {};

  useEffect(() => {
    if (!tier || !price) {
      navigate('/pricing');
      return;
    }
    fetchBanks();
  }, [tier, price, navigate]);

  // Auto-submit form when payment data is ready
  useEffect(() => {
    if (paymentData && formRef.current && !processingPayment) {
      setProcessingPayment(true);
      // Small delay to show the "Redirecting..." message
      setTimeout(() => {
        formRef.current.submit();
      }, 1000);
    }
  }, [paymentData, processingPayment]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/fpx/banks?type=B2C');
      setBanks(response.data.banks);
    } catch (error) {
      console.error('Error fetching banks:', error);
      alert('Failed to load bank list');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!selectedBank) {
      alert('Please select your bank');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Get user info
      const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = userResponse.data;

      // Initiate payment
      const response = await axios.post(
        'http://localhost:5000/api/fpx/initiate',
        {
          tier,
          price,
          bankCode: selectedBank,
          customerName: user.name,
          customerEmail: user.email
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPaymentData(response.data);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  if (processingPayment) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Redirecting to FPX...</h2>
          <p className="text-gray-400">Please wait while we redirect you to your bank</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/pricing')}
            className="text-teal-400 hover:text-teal-300 font-medium mb-4"
          >
            ← Back to Pricing
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-gray-400">Secure payment via FPX</p>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Plan:</span>
              <span className="text-white font-semibold">{planName || tier}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Billing:</span>
              <span className="text-white">Monthly</span>
            </div>
            <div className="border-t border-slate-700 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-teal-400">RM {price}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">per month</p>
            </div>
          </div>
        </div>

        {/* Bank Selection */}
        <div className="bg-slate-800 rounded-2xl p-6">
          <form onSubmit={handlePayment}>
            <h2 className="text-xl font-bold text-white mb-4">
              Select Your Bank
            </h2>

            {loading && !paymentData ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading banks...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {banks.map((bank) => (
                    <label
                      key={bank.code}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedBank === bank.code
                          ? 'border-teal-500 bg-teal-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="bank"
                        value={bank.code}
                        checked={selectedBank === bank.code}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedBank === bank.code
                              ? 'border-teal-500'
                              : 'border-slate-600'
                          }`}
                        >
                          {selectedBank === bank.code && (
                            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                          )}
                        </div>
                        <span className="text-white font-medium">{bank.name}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!selectedBank || loading}
                  className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
                    !selectedBank || loading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg hover:shadow-teal-500/50'
                  }`}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {/* Security Notice */}
                <div className="mt-6 flex items-start gap-3 text-sm text-gray-400">
                  <svg
                    className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p>
                    Your payment is secured by FPX (Financial Process Exchange), Malaysia's
                    national payment gateway. You will be redirected to your bank's secure
                    login page.
                  </p>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Hidden form for FPX redirect */}
        {paymentData && (
          <form
            ref={formRef}
            method="POST"
            action={paymentData.gatewayUrl}
            style={{ display: 'none' }}
          >
            {Object.entries(paymentData.formData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form>
        )}
      </div>
    </div>
  );
};

export default FPXCheckout;
