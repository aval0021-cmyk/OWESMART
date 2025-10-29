import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { signInWithGoogle } from '../config/firebase';
import GlobalLogo from '../components/GlobalLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleAuth, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! Login successful 🎉');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!agreeTerms) {
      setError('Please agree to Terms & Conditions');
      toast.error('Please agree to Terms & Conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = await signInWithGoogle();
      
      // Send userData to backend to create/login user
      await googleAuth({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        emailVerified: userData.emailVerified
      });
      
      toast.success(`Welcome back, ${userData.displayName}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Google sign-in failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Column - Login Form (40% width on desktop) */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <GlobalLogo size="sm" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              OweSmart
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Log in to your account.</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome back! Please enter your details.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I agree to OweSmart's{' '}
                <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-700">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button 
                type="button" 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't you have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
                Sign Up
              </Link>
            </div>
          </form>

        </div>
      </div>

      {/* Right Column - Marketing Panel (60% width on desktop) */}
      <div className="hidden lg:flex w-full lg:w-3/5 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 relative overflow-hidden items-center justify-center p-16">
        
        {/* Hexagon Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                           linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                           linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                           linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1))`,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
        }}></div>

        {/* Content Container */}
        <div className="relative z-10 text-center space-y-8 max-w-2xl">
          <h2 className="text-5xl font-bold text-white leading-tight drop-shadow-2xl">
            The easiest way to manage your debts.
          </h2>
          <p className="text-xl text-white/95 drop-shadow-lg">
            Join the OweSmart community and take control of your financial future!
          </p>
        </div>

        {/* Floating Dashboard Elements */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* Dashboard Card 1 - Total Debt */}
          <div className="absolute top-20 left-16 animate-float" style={{animation: 'float 6s ease-in-out infinite'}}>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 shadow-2xl border border-white/30 w-72">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium text-sm">Total Debt</span>
                <svg className="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-1">$45,230</div>
              <div className="text-green-200 text-sm font-medium">-8.2% from last month</div>
              {/* Mini debt categories */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/90">Credit Cards</span>
                  <span className="text-white font-semibold">$12,500</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/90">Student Loans</span>
                  <span className="text-white font-semibold">$28,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/90">Personal Loan</span>
                  <span className="text-white font-semibold">$4,730</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Card 2 - Payment Progress */}
          <div className="absolute bottom-20 right-16 animate-float" style={{animation: 'float 8s ease-in-out infinite', animationDelay: '1s'}}>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 shadow-2xl border border-white/30 w-80">
              <div className="text-white font-medium text-sm mb-3">Monthly Payment Progress</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-white text-sm mb-2">
                    <span>March 2025</span>
                    <span className="font-bold">$1,850 / $2,500</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-300 to-emerald-200 h-3 rounded-full shadow-sm" style={{width: '74%'}}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-xs text-white/80">Payments Made</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-200">$22K</div>
                    <div className="text-xs text-white/80">Total Paid</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-white/80">Months Left</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Card 3 - AI Coach Tip */}
          <div className="absolute top-1/2 right-20 -translate-y-1/2 animate-float hidden xl:block" style={{animation: 'float 7s ease-in-out infinite', animationDelay: '0.5s'}}>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/30 w-64">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <span className="text-white font-medium text-sm">AI Coach Tip</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                "You're on track! Consider allocating your tax refund to your highest-interest debt for maximum savings."
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
