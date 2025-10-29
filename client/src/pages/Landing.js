import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle account icon click
  const handleAccountClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with Hamburger Menu */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-emerald-600 transition p-2 rounded-lg hover:bg-gray-100"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <img 
                src="/logo.jpg" 
                alt="OweSmart" 
                className="w-8 h-8 object-cover rounded-lg" 
                onError={(e)=>{e.currentTarget.style.display='none'}} 
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              OweSmart
            </span>
          </div>

          {/* Account Icon Button */}
          <button
            onClick={handleAccountClick}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition shadow-md hover:shadow-lg"
            aria-label={user ? "Go to Dashboard" : "Login"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span className="font-medium hidden sm:inline">
              {user ? 'Dashboard' : 'Login'}
            </span>
          </button>

        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 animate-slideDown">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-emerald-600">Home</p>
                    <p className="text-xs text-gray-500">Back to homepage</p>
                  </div>
                </Link>

                <Link 
                  to="/how-it-works" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-emerald-600">How It Works</p>
                    <p className="text-xs text-gray-500">Learn about our process</p>
                  </div>
                </Link>

                <Link 
                  to="/pricing" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-emerald-600">Pricing</p>
                    <p className="text-xs text-gray-500">View our plans</p>
                  </div>
                </Link>

                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-emerald-600 group-hover:text-emerald-700">Login</p>
                    <p className="text-xs text-gray-500">Access your account</p>
                  </div>
                </Link>

                <button 
                  onClick={() => { setMenuOpen(false); navigate('/register'); }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition shadow-md group"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <div className="text-left">
                    <p className="font-semibold">Get Started</p>
                    <p className="text-xs text-white/80">Create your free account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                💰 Smart Debt Management
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              The easiest way to manage your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                debts
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Take control of your financial future with AI-powered debt tracking, personalized coaching, and smart payment strategies. Join thousands who are already debt-free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-500/30"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-lg hover:border-emerald-600 hover:text-emerald-600 transition"
              >
                Login
              </button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Free to start</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">AI-powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Secure & private</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div className="relative lg:pl-8">
            <div className="relative">
              
              {/* Main Dashboard Card */}
              <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                
                {/* Hexagon Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                                   linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1))`,
                  backgroundSize: '80px 140px',
                  backgroundPosition: '0 0, 40px 70px'
                }}></div>

                <div className="relative z-10">
                  <div className="text-white/90 text-sm font-medium mb-2">Your Portfolio</div>
                  <div className="text-4xl font-bold text-white mb-6">$45,230</div>

                  {/* Mini Cards Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-white font-semibold">Track Debts</div>
                      <div className="text-white/70 text-xs">Real-time updates</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                      <div className="text-2xl mb-1">💡</div>
                      <div className="text-white font-semibold">AI Coach</div>
                      <div className="text-white/70 text-xs">Smart advice</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between text-white text-sm mb-2">
                      <span>Monthly Goal</span>
                      <span className="font-bold">74%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-300 to-teal-200 h-2 rounded-full" style={{width: '74%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Tip Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-xs border border-gray-200 animate-float">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">AI Tip</div>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      Pay $200 extra this month to save $1,500 in interest!
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to become debt-free
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features to help you take control of your finances
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Debt Tracking</h3>
              <p className="text-gray-600">
                Visualize all your debts in one place with automatic updates and progress tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get personalized recommendations and smart strategies to pay off debt faster.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Management</h3>
              <p className="text-gray-600">
                Schedule payments, set reminders, and never miss a due date again.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>
            By using OweSmart, you agree to our{' '}
            <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Terms & Conditions
            </Link>
            {' '}and{' '}
            <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Privacy Policy
            </Link>
          </p>
          <p className="mt-2 text-gray-500">© 2025 OweSmart. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
