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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-slate-900 pb-24">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex justify-between items-center gap-2 sm:gap-4">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-slate-300 hover:text-white transition p-1.5 sm:p-2 rounded-lg hover:bg-slate-700"
              aria-label="Menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>

            {/* Logo */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <img 
                src="/logo.jpg" 
                alt="OweSmart" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-lg" 
                onError={(e)=>{e.currentTarget.style.display='none'}} 
              />
            </div>

            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent hidden sm:inline">
              OweSmart
            </span>
          </div>

          {/* Center: User Greeting */}
          <div className="flex-1 text-center">
            <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white mb-0.5 sm:mb-1">
              Hi {user?.name?.split(' ')[0] || 'Alya'}
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 hidden sm:block">Here's your debt overview</p>
          </div>

          {/* Right: Notifications and Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <NotificationCenter />
            <button
              onClick={logout}
              className="bg-slate-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-slate-600 text-xs sm:text-sm lg:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="mt-4 bg-slate-800 rounded-lg shadow-xl border border-slate-700 animate-slideDown">
            <div className="p-2">
              <button 
                onClick={() => { setMenuOpen(false); navigate('/'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-teal-400">Home</p>
                  <p className="text-xs text-slate-400">Back to homepage</p>
                </div>
              </button>

              <button 
                onClick={() => { setMenuOpen(false); navigate('/add-debt'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-teal-400">Add Debt</p>
                  <p className="text-xs text-slate-400">Record a new debt</p>
                </div>
              </button>

              <button 
                onClick={() => { setMenuOpen(false); navigate('/payment'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-teal-400">Record Payment</p>
                  <p className="text-xs text-slate-400">Track your payment</p>
                </div>
              </button>

              <button 
                onClick={() => { setMenuOpen(false); navigate('/ai-coach'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-teal-400">AI Coach</p>
                  <p className="text-xs text-slate-400">Get smart advice</p>
                </div>
              </button>

              <button 
                onClick={() => { setMenuOpen(false); navigate('/how-it-works'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-teal-400">How It Works</p>
                  <p className="text-xs text-slate-400">Learn the process</p>
                </div>
              </button>

              <button 
                onClick={() => { setMenuOpen(false); navigate('/pricing'); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-white group-hover:text-teal-400">Pricing</p>
                  <p className="text-xs text-slate-400">View our plans</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pt-6">
        {/* Stats Card - White background - Mobile Optimized */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="flex justify-between sm:block">
              <p className="text-slate-600 text-xs mb-1 font-medium">Total Debt</p>
              <p className="text-slate-900 text-lg sm:text-xl font-bold">
                RM {overview?.totalDebt?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="flex justify-between sm:block">
              <div>
                <p className="text-slate-600 text-xs mb-1 font-medium">Next Payment</p>
                <p className="text-slate-500 text-xs sm:hidden">
                  {overview?.nextPayment ? `due in ${overview.nextPayment.daysUntil} days` : 'No payments due'}
                </p>
              </div>
              <div>
                <p className="text-slate-900 text-lg sm:text-xl font-bold">
                  RM {overview?.nextPayment?.amount?.toLocaleString() || '0'}
                </p>
                <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">
                  {overview?.nextPayment ? `due in ${overview.nextPayment.daysUntil} days` : 'No payments due'}
                </p>
              </div>
            </div>
            <div className="flex justify-between sm:block">
              <p className="text-slate-600 text-xs mb-1 font-medium">Progress</p>
              <p className="text-slate-900 text-lg sm:text-xl font-bold">
                Debt-free: {overview?.progress || 0}%
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

        {/* Active Debts Section */}
        <h2 className="text-white text-lg sm:text-xl font-bold mb-3 mt-6">Active Debts</h2>
        
        {overview?.activeDebts && overview.activeDebts.length > 0 ? (
          <div className="space-y-3">
            {overview.activeDebts.map((debt) => (
              <div key={debt.id} className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${getPriorityColor(debt.priority)}`}></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-1 break-words">
                        {debt.name} – {debt.institution}
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm">
                        RM {debt.amount.toLocaleString()} · Interest: {debt.interestRate}%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 self-start sm:ml-2 flex-shrink-0">
                    {getPriorityLabel(debt.priority)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl p-4 sm:p-6 text-center border border-slate-700">
            <p className="text-slate-400 text-sm sm:text-base">No active debts. Add your first debt to get started!</p>
          </div>
        )}

        {/* AI Strategy Suggestion */}
        {suggestion?.suggestion && (
          <div className="bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-700 mt-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-1 pt-0.5">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2 text-base sm:text-lg">
                  🤖 AI Strategy Suggestion
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{suggestion.suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* End Main Content */}

      {/* Bottom Navigation - Mobile Optimized */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 pb-safe">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          <button 
            type="button" 
            onClick={() => navigate('/payment')} 
            className="flex flex-col items-center text-slate-400 hover:text-white transition-colors px-3 py-2"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            <span className="font-medium text-xs sm:text-sm">Payment</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/add-debt')} 
            className="flex flex-col items-center text-slate-400 hover:text-white transition-colors px-3 py-2"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span className="font-medium text-xs sm:text-sm">Add Debt</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/ai-coach')} 
            className="flex flex-col items-center text-slate-400 hover:text-white transition-colors px-3 py-2"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span className="font-medium text-xs sm:text-sm">AI Coach</span>
          </button>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 sm:right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
          <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Back to Top
          </span>
        </button>
      )}
    </div>
  );
};

export default Dashboard;
