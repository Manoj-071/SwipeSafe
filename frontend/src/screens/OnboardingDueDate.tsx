import React, { useState, useEffect } from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { ProgressDots } from '../components/ProgressDots';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const OnboardingDueDate: React.FC = () => {
  const { navigateTo } = useCardProfile();
  const [dueDate, setDueDate] = useState<number>(15);

  useEffect(() => {
    const saved = sessionStorage.getItem('swipesafe_temp_dueDate');
    if (saved) {
      setDueDate(parseInt(saved, 10));
    }
  }, []);

  const handleNext = () => {
    sessionStorage.setItem('swipesafe_temp_dueDate', dueDate.toString());
    navigateTo('onboarding-4');
  };

  // Generate 1 to 31 array
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Helper to format day suffix (e.g. 1st, 2nd, 3rd, 4th)
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-50 font-sans max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigateTo('onboarding-2')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Step 3 of 4
        </span>
        <div className="w-5" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            When is your bill due?
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4">
            Select the day of the month your card statement payment is due (e.g. the 15th).
          </p>
        </div>

        {/* Big Display */}
        <div className="text-center">
          <span className="text-5xl font-black text-indigo-600">
            {dueDate}
          </span>
          <span className="text-2xl font-bold text-indigo-400">
            {getOrdinalSuffix(dueDate)}
          </span>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">of every month</p>
        </div>

        {/* Tappable Days Grid */}
        <div className="grid grid-cols-7 gap-2 max-w-sm mx-auto p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
          {days.map((day) => {
            const isSelected = day === dueDate;
            return (
              <button
                key={day}
                onClick={() => setDueDate(day)}
                className={`h-9 w-9 text-xs font-bold rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-6 pb-4">
        <ProgressDots currentStep={3} />
        
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
