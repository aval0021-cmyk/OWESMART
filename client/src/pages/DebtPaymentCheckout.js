import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DebtPaymentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Get debt payment details from location state
  const { debt, amount } = location.state || {};

  useEffect(() => {
    if (!debt || !amount) {
      navigate('/payment');
      return;
    }
    fetchBanks();
  }, [debt, amount, navigate]);

  // Auto-submit form when payment data is ready
  useEffect(() => {
    if (paymentData && formRef.current && !processingPayment) {
      setProcessingPayment(true);
      
      // DEMO MODE: Instead of redirecting to FPX, simulate success after 2 seconds
      console.log('DEMO MODE: Simulating FPX payment...');
      console.log('Payment Data:', paymentData);
      
      setTimeout(() => {
        // Redirect to result page with orderId, amount, and demo status
        window.location.href = `/debt-payment/result?orderId=${paymentData.orderId}&status=00&amount=${amount}`;
      }, 2000);
      
      // PRODUCTION MODE: Uncomment below to use real FPX
      // formRef.current.submit();
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

      // Initiate debt payment
      const response = await axios.post(
        'http://localhost:5000/api/fpx/debt/initiate',
        {
          debtId: debt.id,
          amount: parseFloat(amount),
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
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-black mb-2">Redirecting to FPX...</h2>
          <p className="text-gray-600">Please wait while we redirect you to your bank</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Demo Mode Banner */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎮</span>
            <div>
              <h3 className="font-bold text-yellow-900">DEMO MODE</h3>
              <p className="text-sm text-yellow-800">
                This is a simulation. No real payment will be processed.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/payment')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back to Payment Options
          </button>
          <h1 className="text-3xl font-bold text-black mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment via FPX</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-black mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Debt:</span>
              <span className="text-black font-semibold">{debt?.name}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Institution:</span>
              <span className="text-black">{debt?.institution}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Current Balance:</span>
              <span className="text-black">RM {(debt?.currentBalance || debt?.amount || 0).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-xl font-bold text-black">Payment Amount</span>
                <span className="text-2xl font-bold text-blue-600">RM {parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Balance:</span>
                <span className="text-blue-700 font-bold">
                  RM {((debt?.currentBalance || debt?.amount || 0) - parseFloat(amount)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Selection */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <form onSubmit={handlePayment}>
            <h2 className="text-xl font-bold text-black mb-4">
              Select Your Bank
            </h2>

            {loading && !paymentData ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading banks...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {banks.map((bank) => (
                    <label
                      key={bank.code}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedBank === bank.code
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
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
                              ? 'border-blue-600'
                              : 'border-gray-400'
                          }`}
                        >
                          {selectedBank === bank.code && (
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                        <span className="text-black font-medium">{bank.name}</span>
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
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
                  }`}
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {/* Security Notice */}
                <div className="mt-6 flex items-start gap-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                    login page to complete the payment.
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

export default DebtPaymentCheckout;
