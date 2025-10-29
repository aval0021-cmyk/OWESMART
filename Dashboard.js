import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardOverview, getSuggestedStrategy } from '../services/api';
import NotificationCenter from '../components/NotificationCenter';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [overviewRes, suggestionRes] = await Promise.all([
        getDashboardOverview(),
        getSuggestedStrategy()
      ]);
      setOverview(overviewRes.data);
      setSuggestion(suggestionRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'High': return 'High-In';
      case 'Medium': return 'Medium';
      case 'Low': return 'Low';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-24 max-w-md mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 px-6 pt-8 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-1">
              Hi {user?.name?.split(' ')[0] || 'Alya'}
            </h1>
            <p className="text-slate-300 text-base mb-1">here's your debt overview</p>
            <p className="text-slate-400 text-xs">
              Last updated: Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <button
              onClick={logout}
              className="bg-slate-700 text-white px-3 py-1.5 rounded-lg hover:bg-slate-600"
              style={{fontSize: '18px'}}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Card - White background */}
        <div className="bg-white rounded-2xl p-5 shadow-xl">
          <div className="grid grid-cols-3 mb-4" style={{gap: '20px'}}>
            <div>
              <p className="text-slate-600 text-xs mb-1 font-medium">Total Debt</p>
              <p className="text-slate-900 text-xl font-bold">
                RM {overview?.totalDebt?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-xs mb-1 font-medium">Next Payment</p>
              <p className="text-slate-900 text-xl font-bold">
                RM {overview?.nextPayment?.amount?.toLocaleString() || '0'}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {overview?.nextPayment ? `due in ${overview.nextPayment.daysUntil} days` : 'No payments due'}
              </p>
            </div>
            <div>
              <p className="text-slate-600 text-xs mb-1 font-medium">Progress</p>
              <p className="text-slate-900 text-xl font-bold">
                Debt-
              </p>
              <p className="text-slate-900 text-2xl font-bold -mt-1">
                {overview?.progress || 0}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-teal-500 h-2.5 rounded-full transition-all"
              style={{ width: `${overview?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Debts Section */}
      <div className="px-6 mt-6">
        <h2 className="text-white text-xl font-bold" style={{marginBottom: '10px'}}>Active Debts</h2>
        
        {overview?.activeDebts && overview.activeDebts.length > 0 ? (
          <div className="space-y-3">
            {overview.activeDebts.map((debt) => (
              <div key={debt.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${getPriorityColor(debt.priority)}`}></div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base mb-1">
                        {debt.name} – {debt.institution}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        RM {debt.amount.toLocaleString()} · Interest: {debt.interestRate}%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 ml-2 flex-shrink-0">
                    {getPriorityLabel(debt.priority)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
            <p className="text-slate-400">No active debts. Add your first debt to get started!</p>
          </div>
        )}

        {/* AI Strategy Suggestion */}
        {suggestion?.suggestion && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700" style={{marginTop: '15px'}}>
            <div className="flex items-start gap-3">
              <div className="flex-1 pt-0.5">
                <h3 className="text-white font-semibold mb-1.5 flex items-center gap-2" style={{fontSize: '20px'}}>
                  AI Strategy Suggestion
                </h3>
                <p className="text-slate-300 leading-relaxed" style={{fontSize: '15px'}}>{suggestion.suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
  <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 pb-6 bottom-nav" style={{paddingTop: '15px'}}>
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button type="button" onClick={() => navigate('/payment')} className="flex flex-col items-center text-slate-400 hover:text-slate-300 px-6 py-4 bg-transparent border-0 outline-none appearance-none focus:outline-none cursor-pointer select-none">
            <span className="font-medium" style={{fontSize: '18px'}}>Payment</span>
          </button>
          
          <button type="button" onClick={() => navigate('/add-debt')} className="flex flex-col items-center text-slate-400 hover:text-slate-300 px-6 py-4 bg-transparent border-0 outline-none appearance-none focus:outline-none cursor-pointer select-none">
            <span className="font-medium" style={{fontSize: '18px'}}>Add</span>
          </button>
          
          <button type="button" onClick={() => navigate('/ai-coach')} className="flex flex-col items-center text-slate-400 hover:text-slate-300 px-6 py-4 bg-transparent border-0 outline-none appearance-none focus:outline-none cursor-pointer select-none">
            <span className="font-medium" style={{fontSize: '18px'}}>AI Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
