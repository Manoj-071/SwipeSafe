import React from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { ShieldCheck, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useCardProfile();

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-50 font-sans max-w-md mx-auto">
      {/* Top Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 pt-10">
        {/* App Logo/Graphic */}
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-lg text-white font-extrabold text-3xl">
            S
          </div>
          <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-teal-400 rounded-full flex items-center justify-center shadow border-2 border-slate-50 text-slate-900">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Swipe<span className="text-indigo-600">Safe</span>
          </h1>
          <p className="text-indigo-900/60 text-sm font-semibold tracking-wider uppercase">
            Pre-Purchase Credit Decision Assistant
          </p>
        </div>

        {/* Value Prop */}
        <p className="text-lg font-bold text-slate-700 max-w-xs leading-snug">
          Know if it's safe to swipe before you buy.
        </p>

        {/* Short bullet benefits */}
        <div className="w-full space-y-4 pt-6 text-left max-w-xs">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 mt-0.5">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Healthy Utilization</h3>
              <p className="text-xs text-slate-500 font-medium">Keep your credit card balance below the critical 30% mark.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600 mt-0.5">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Avoid Interest Traps</h3>
              <p className="text-xs text-slate-500 font-medium">See the actual compounding shock cost of minimum monthly payments.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Simulate Score Changes</h3>
              <p className="text-xs text-slate-500 font-medium">Get a simulated estimate of credit score changes before swiping.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Footer */}
      <div className="space-y-4 pt-6">
        <button
          onClick={() => navigateTo('onboarding-1')}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm"
        >
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-[10px] text-center text-slate-400 font-semibold uppercase tracking-wider">
          Made for first-time credit users in India • No bank login needed
        </p>
      </div>
    </div>
  );
};
