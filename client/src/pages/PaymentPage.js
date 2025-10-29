import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedDebt, setSelectedDebt] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/debts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDebts(response.data.filter(debt => debt.status === 'Active'));
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/payments',
        {
          debtId: selectedDebt,
          amount: parseFloat(amount),
          paymentDate,
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      toast.success('Payment recorded successfully! +10 points earned 🎉');
      
      // Award gamification points
      try {
        await axios.post(
          'http://localhost:5000/api/gamification/points',
          { points: 10, action: 'payment_recorded' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error awarding points:', error);
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Payment Recorded! 🎉</h2>
          <p className="text-gray-600 mb-2">+10 points earned</p>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-black mb-2">Record Payment</h1>
        <p className="text-gray-600">Track your debt repayment progress</p>
      </div>

      {/* Payment Form */}
      <div>
        {debts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border-2 border-gray-200">
            <h3 className="text-xl font-semibold text-black mb-2">No Active Debts</h3>
            <p className="text-gray-600 mb-6">You need to add a debt before you can record payments.</p>
            <button
              onClick={() => navigate('/add-debt')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Your First Debt
            </button>
          </div>
        ) : (
        <>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Debt */}
          <div>
            <label className="block text-black font-medium mb-3">
              Select Debt
            </label>
            <select
              value={selectedDebt}
              onChange={(e) => setSelectedDebt(e.target.value)}
              required
              className="w-full px-4 py-4 rounded-2xl bg-white text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose a debt...</option>
              {debts.map((debt) => (
                <option key={debt.id} value={debt.id}>
                  {debt.name} - RM {debt.currentBalance?.toFixed(2) || debt.amount?.toFixed(2) || '0.00'}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-black font-medium mb-3">
              Payment Amount (RM)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="0.00"
              className="w-full px-4 py-4 rounded-2xl bg-white text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-xl"
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-black font-medium mb-3">
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full px-4 py-4 rounded-2xl bg-white text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-black font-medium mb-3">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this payment..."
              rows={4}
              className="w-full px-4 py-4 rounded-2xl bg-white text-black border-2 border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
              loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
            }`}
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </form>

        {/* Quick Stats */}
        {selectedDebt && (
          <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="text-black font-semibold mb-4">Selected Debt Info</h3>
            {debts
              .filter((d) => d.id === parseInt(selectedDebt))
              .map((debt) => (
                <div key={debt.id} className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Current Balance:</span>
                    <span className="text-black font-semibold">
                      RM {debt.currentBalance?.toFixed(2) || debt.amount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span className="text-black font-semibold">{debt.interestRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Payment:</span>
                    <span className="text-black font-semibold">RM {debt.minimumPayment?.toFixed(2) || '0.00'}</span>
                  </div>
                  {amount && (
                    <div className="flex justify-between pt-4 border-t border-gray-300">
                      <span>New Balance:</span>
                      <span className="text-blue-600 font-bold text-xl">
                        RM {((debt.currentBalance || debt.amount || 0) - parseFloat(amount)).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
