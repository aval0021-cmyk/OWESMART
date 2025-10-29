import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'owesmart',
      name: 'OweSmarts',
      subtitle: 'Individual Premium',
      price: 19.90,
      color: 'from-teal-400 to-teal-500',
      features: [
        'Combine credit cards, personal loans, and Buy Now, Pay Later (BNPL) debt into a single, intuitive dashboard.',
        'Receive automatic recommendations for the most cost-effective repayment strategy (Avalanche or Snowball) to maximize interest savings.',
        'Stay engaged with visual progress trackers, milestone rewards, and personalized nudges to turn debt management into an achievable goal.',
        'Get accessible financial guidance powered by our integrated AI coach.'
      ]
    },
    {
      id: 'owesmarter',
      name: 'OweSmarter',
      subtitle: 'Premium Plus',
      price: 99,
      color: 'from-cyan-400 to-blue-500',
      popular: true,
      features: [
        'All features from the OweSmart Premium plan.',
        'Connect with Credit Reporting Agencies (CRAs) like CTOS and Experian to monitor your credit score directly within the app.',
        'Get deeper analysis and "what-if" scenarios from your AI coach to understand how different payment strategies will impact your long-term financial goals.',
        'Receive dedicated customer support to assist with your financial tracking and strategy.'
      ]
    },
    {
      id: 'owebigsmarts',
      name: 'OweBigSmarts',
      subtitle: 'SMEs',
      price: 299,
      color: 'from-orange-400 to-orange-500',
      features: [
        'All features from the OweSmarter plan.',
        'Track and strategize repayment for both business operating loans and personal credit lines in one place.',
        'Our AI engine analyzes your business cycles to provide strategic recommendations that reduce the risk of default and high-interest exposure.',
        'Allow your finance team or business partners access to manage and monitor the company\'s financial strategy.',
        'Promote the app as an employee wellness program to support your team\'s financial health.'
      ]
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    
    // Find the selected plan
    const plan = plans.find(p => p.id === planId);
    
    // Navigate to FPX checkout with plan details
    navigate('/fpx-checkout', {
      state: {
        tier: plan.name,
        price: plan.price,
        planName: plan.name
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-300">
            Smart debt coaching for individuals and businesses
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all ${
                plan.popular ? 'ring-4 ring-blue-400' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className={`bg-gradient-to-r ${plan.color} rounded-2xl p-6 text-center mb-6`}>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">
                  {plan.name}
                </h2>
                <p className="text-slate-800 font-medium mb-3">{plan.subtitle}</p>
                <div className="text-4xl font-bold text-slate-900">
                  RM {plan.price}
                </div>
                <p className="text-slate-800 text-sm mt-1">per month</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all`}
              >
                {plan.id === 'owesmart' ? 'Get started with OweSmarts' : 
                 plan.id === 'owesmarter' ? 'Upgrade to OweSmarter' : 
                 'Empower your business'}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-slate-300 mb-4">
            Already have an account?
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Sign in here
          </button>
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Compare Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-white">
            <div>
              <h4 className="font-bold mb-2 text-teal-400">OweSmart</h4>
              <p className="text-sm text-slate-300">Perfect for individuals managing personal debt</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-cyan-400">OweSmarter</h4>
              <p className="text-sm text-slate-300">Advanced features with credit monitoring</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-orange-400">OweBigSmarts</h4>
              <p className="text-sm text-slate-300">Enterprise solution for SMEs and teams</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
