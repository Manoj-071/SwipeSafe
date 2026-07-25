import React, { useState, useEffect } from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { CurrencyInput } from '../components/CurrencyInput';
import { ProgressDots } from '../components/ProgressDots';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const OnboardingLimit: React.FC = () => {
  const { navigateTo } = useCardProfile();
  const [limit, setLimit] = useState<number>(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('swipesafe_temp_limit');
    if (saved) {
      setLimit(parseInt(saved, 10));
    }
  }, []);

  const handleNext = () => {
    if (limit <= 0) {
      setError('Please enter a valid credit limit greater than ₹0');
      return;
    }
    if (limit < 5000) {
      setError('Limit seems too low. Credit card limits usually start at ₹5,000.');
      return;
    }
    setError('');
    sessionStorage.setItem('swipesafe_temp_limit', limit.toString());
    navigateTo('onboarding-2');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-50 font-sans max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigateTo('welcome')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Step 1 of 4
        </span>
        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            What is your credit card limit?
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4">
            This is the maximum spending power of your card, usually printed on your welcome letter or bank app.
          </p>
        </div>

        {/* Big Currency Input */}
        <div className="py-4">
          <CurrencyInput
            value={limit}
            onChange={(val) => {
              setLimit(val);
              if (val > 0) setError('');
            }}
            placeholder="50,000"
            autoFocus
          />
          {error && (
            <p className="text-xs text-rose-500 font-semibold text-center mt-3 animate-pulse">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-6 pb-4">
        <ProgressDots currentStep={1} />
        
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
