import React, { useState } from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { CurrencyInput } from '../components/CurrencyInput';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PurchaseCheckInput: React.FC = () => {
  const { checkPurchase, navigateTo } = useCardProfile();
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Please enter a purchase amount greater than ₹0');
      return;
    }
    setError('');
    const result = checkPurchase(amount);
    if (result) {
      navigateTo('verdict');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-50 font-sans max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigateTo('home')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Purchase Check
        </span>
        <div className="w-8" />
      </div>

      {/* Main Content Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            How much is the purchase?
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4">
            Enter the amount you are about to swipe. SwipeSafe will simulate the impacts instantly.
          </p>
        </div>

        {/* Big formatted input */}
        <div className="py-4">
          <CurrencyInput
            value={amount}
            onChange={(val) => {
              setAmount(val);
              if (val > 0) setError('');
            }}
            placeholder="0"
            autoFocus
          />
          {error && (
            <p className="text-xs text-rose-500 font-semibold text-center mt-3 animate-pulse">
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Footer CTA */}
      <div className="pb-4">
        <button
          onClick={handleSubmit}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm"
        >
          <span>Evaluate Swipe</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
