import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      // Store agreement in localStorage
      localStorage.setItem('termsAgreed', 'true');
      navigate('/register'); // or wherever you want to redirect
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">
        Terms & Conditions
      </h1>

      {/* Teal Box with Terms */}
      <div className="w-full max-w-2xl bg-gradient-to-br from-teal-400 to-teal-500 rounded-3xl p-6 md:p-8 mb-6 shadow-lg">
        <h2 className="text-xl font-bold text-black mb-4">Terms & Conditions</h2>
        <div className="text-black text-sm md:text-base leading-relaxed space-y-3">
          <p>
            By using OweSmart, you agree to our Terms and Privacy Policy. OweSmart is an AI-powered debt coaching 
            platform by OweSmart Technologies Sdn. Bhd., designed to help you track, manage, and repay your debts 
            smarter. We may collect financial information from your connected accounts — including banks, credit cards, 
            and third-party platforms like Grab, Shopee, Atome, and other e-wallet or BNPL services — to provide accurate 
            insights and repayment plans. All data is processed securely under Malaysia's Personal Data Protection Act 
            (PDPA) and will never be sold or shared without your consent. Our AI tools offer general recommendations only 
            and should not replace licensed financial advice. By continuing, you confirm that all information provided is 
            true, that you're over 18, and that you'll use OweSmart responsibly and lawfully.
          </p>
        </div>
      </div>

      {/* Checkbox Agreement */}
      <div className="w-full max-w-2xl mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
          />
          <span className="text-gray-700 text-sm md:text-base">
            Agree & Continue — I've read the Terms and Privacy Policy.
          </span>
        </label>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!agreed}
        className={`w-full max-w-sm py-3 rounded-full font-semibold text-base transition-all ${
          agreed
            ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

export default TermsAndConditions;
