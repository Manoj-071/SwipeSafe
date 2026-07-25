import React, { useState, useEffect } from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { CurrencyInput } from '../components/CurrencyInput';
import { ProgressDots } from '../components/ProgressDots';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

export const OnboardingBalance: React.FC = () => {
  const { navigateTo } = useCardProfile();
  const [balance, setBalance] = useState<number>(0);
  const [error, setError] = useState('');
  const [limit, setLimit] = useState<number>(50000);

  useEffect(() => {
    const savedLimit = sessionStorage.getItem('swipesafe_temp_limit');
    if (savedLimit) {
      setLimit(parseInt(savedLimit, 10));
    }

    const savedBalance = sessionStorage.getItem('swipesafe_temp_balance');
    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    }
  }, []);

  const handleNext = () => {
    if (balance < 0) {
      setError('Outstanding balance cannot be negative');
      return;
    }
    if (balance > limit) {
      setError(`Outstanding (₹${balance.toLocaleString('en-IN')}) cannot exceed your card limit (₹${limit.toLocaleString('en-IN')})`);
      return;
    }
    setError('');
    sessionStorage.setItem('swipesafe_temp_balance', balance.toString());
    navigateTo('onboarding-3');
  };

  const handleStartFresh = () => {
    setBalance(0);
    setError('');
    sessionStorage.setItem('swipesafe_temp_balance', '0');
    navigateTo('onboarding-3');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-50 font-sans max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigateTo('onboarding-1')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Step 2 of 4
        </span>
        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            Do you owe anything right now?
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4">
            Enter your current unpaid credit card bill. You can also skip this if your card is fresh.
          </p>
        </div>

        {/* Currency Input */}
        <div className="py-2">
          <CurrencyInput
            value={balance}
            onChange={(val) => {
              setBalance(val);
              if (val >= 0) setError('');
            }}
            placeholder="0"
          />
          {error && (
            <p className="text-xs text-rose-500 font-semibold text-center mt-3 animate-pulse">
              {error}
            </p>
          )}
        </div>

        {/* Start Fresh Link Button */}
        <button
          onClick={handleStartFresh}
          className="flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-2xl text-xs font-bold transition-all w-fit mx-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Start Fresh — I owe ₹0</span>
        </button>
      </div>

      {/* Footer */}
      <div className="space-y-6 pb-4">
        <ProgressDots currentStep={2} />
        
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
