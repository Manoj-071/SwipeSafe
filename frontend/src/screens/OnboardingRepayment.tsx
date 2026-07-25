import React, { useState, useEffect } from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { ProgressDots } from '../components/ProgressDots';
import { ArrowLeft, CheckCircle2, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

export const OnboardingRepayment: React.FC = () => {
  const { onboardUser, navigateTo } = useCardProfile();
  const [habit, setHabit] = useState<'full' | 'minimum' | 'depends'>('full');
  
  const [limit, setLimit] = useState(50000);
  const [balance, setBalance] = useState(0);
  const [dueDate, setDueDate] = useState(15);

  useEffect(() => {
    const savedLimit = sessionStorage.getItem('swipesafe_temp_limit');
    if (savedLimit) setLimit(parseInt(savedLimit, 10));

    const savedBalance = sessionStorage.getItem('swipesafe_temp_balance');
    if (savedBalance) setBalance(parseInt(savedBalance, 10));

    const savedDue = sessionStorage.getItem('swipesafe_temp_dueDate');
    if (savedDue) setDueDate(parseInt(savedDue, 10));
  }, []);

  const handleFinishOnboarding = () => {
    onboardUser(limit, balance, dueDate, habit);
    
    // Clear session storage onboarding fields
    sessionStorage.removeItem('swipesafe_temp_limit');
    sessionStorage.removeItem('swipesafe_temp_balance');
    sessionStorage.removeItem('swipesafe_temp_dueDate');
  };

  const options = [
    {
      id: 'full' as const,
      title: 'I pay it all off',
      desc: 'I pay the entire statement balance by the due date every month.',
      icon: ShieldCheck,
      color: 'border-emerald-200 bg-emerald-50/10 text-emerald-800',
      activeColor: 'border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-500/20'
    },
    {
      id: 'minimum' as const,
      title: 'I pay only the minimum due',
      desc: 'I usually pay the ~5% minimum amount to keep the card active.',
      icon: ShieldAlert,
      color: 'border-rose-200 bg-rose-50/10 text-rose-800',
      activeColor: 'border-rose-500 bg-rose-50/40 text-rose-900 ring-2 ring-rose-500/20'
    },
    {
      id: 'depends' as const,
      title: 'Depends on the month',
      desc: 'I pay whatever I can afford, sometimes full, sometimes minimum.',
      icon: Sparkles,
      color: 'border-indigo-200 bg-indigo-50/10 text-indigo-800',
      activeColor: 'border-indigo-500 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-50 font-sans max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigateTo('onboarding-3')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Step 4 of 4
        </span>
        <div className="w-5" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center space-y-6 py-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            How do you repay your bill?
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4">
            This pattern helps us calculate accurate interest and predict debt risks.
          </p>
        </div>

        {/* Habitus Cards list */}
        <div className="space-y-3.5">
          {options.map((opt) => {
            const isSelected = habit === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setHabit(opt.id)}
                className={`w-full text-left p-4 rounded-3xl border-2 flex gap-4 transition-all duration-300 ${
                  isSelected ? opt.activeColor : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-2xl h-fit ${
                  isSelected ? 'bg-white shadow-sm' : 'bg-slate-50'
                }`}>
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                </div>
                
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{opt.title}</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">{opt.desc}</p>
                </div>

                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 self-center shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-6 pb-4">
        <ProgressDots currentStep={4} />
        
        <button
          onClick={handleFinishOnboarding}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm"
        >
          <span>Complete Setup</span>
        </button>
      </div>
    </div>
  );
};
