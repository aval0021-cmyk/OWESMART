import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const AddDebt = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    institution: '',
    amount: '',
    interestRate: '',
    minimumPayment: '',
    dueDate: '',
    priority: 'Medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/debts', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Debt added successfully! 🎯');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding debt:', error);
      toast.error(error.response?.data?.message || 'Failed to add debt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-slate-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-2xl font-bold">Add New Debt</h1>
        </div>
        <p className="text-slate-300 text-sm ml-10">Enter your debt details below</p>
      </div>

      {/* Form */}
      <div className="px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Debt Name */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Debt Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Credit Card, Car Loan"
              required
            />
          </div>

          {/* Debt Type */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Debt Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select debt type</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Auto Loan">Auto Loan</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Student Loan">Student Loan</option>
              <option value="BNPL">Buy Now Pay Later (BNPL)</option>
              <option value="Medical Debt">Medical Debt</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Institution *
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Maybank, CIMB, Atome"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Total Amount (RM) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Interest Rate (%) *
            </label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              max="100"
              required
            />
          </div>

          {/* Minimum Payment */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Monthly Payment (RM) *
            </label>
            <input
              type="number"
              name="minimumPayment"
              value={formData.minimumPayment}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
            <p className="text-slate-500 text-xs mt-1">The amount you need to pay every month</p>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Payment Due Day of Month *
            </label>
            <select
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select day (1-31)</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <p className="text-slate-500 text-xs mt-1">Day of the month when payment is due</p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Priority Level *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="High">High - Pay First</option>
              <option value="Medium">Medium - Regular Priority</option>
              <option value="Low">Low - Pay Later</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Debt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebt;
