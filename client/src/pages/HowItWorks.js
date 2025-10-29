import React from 'react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-teal-600 hover:text-teal-700 font-medium text-sm"
        >
          ← Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-3">
          How OweSmart Works
        </h1>
        <p className="text-gray-600 text-center text-sm md:text-base">
          Your journey to becoming debt-free in 3 simple steps
        </p>
      </div>

      {/* Steps Container */}
      <div className="max-w-lg mx-auto space-y-5">
        {/* Step 1 */}
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Step 1: Consolidate Everything
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed">
            Connect all your liabilities in one place—credit cards, personal loans, and even hidden Buy Now, Pay Later (BNPL) 
            debt—for a single, intuitive view.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Step 2: Get Your AI Strategy
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed">
            Our AI coach analyzes your cash flow and automatically recommends the most cost-effective repayment strategy 
            (Avalanche or Snowball) to maximize your interest savings.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl p-6 shadow-lg transform hover:scale-105 transition-transform">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Step 3: Track Your Progress & Win
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed">
            Stay motivated with gamified visual trackers, milestone rewards, and personalized nudges that turn a daunting task 
            into a series of achievable goals.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="max-w-lg mx-auto mt-8">
        <button
          onClick={() => navigate('/register')}
          className="w-full py-3 bg-teal-500 text-white rounded-full font-semibold text-base shadow-lg hover:bg-teal-600 transition-colors"
        >
          Get Started Now
        </button>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default HowItWorks;
