import React from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { simulateMinimumDueTrap } from '../lib/calculator';
import { ArrowLeft, Wifi, Battery, CheckCircle2 } from 'lucide-react';

export const NudgePreviewScreen: React.FC = () => {
  const { activeProfile, navigateTo } = useCardProfile();

  // Fetch or mock variables
  const hasOutstanding = activeProfile && activeProfile.outstandingBalance > 0;
  const outstanding = hasOutstanding ? activeProfile!.outstandingBalance : 15000;
  const apr = activeProfile?.apr || 0.36;
  const trapRes = simulateMinimumDueTrap(outstanding, apr);
  const savings = Math.round(trapRes.totalInterest);

  const formattedOutstanding = outstanding.toLocaleString('en-IN');
  const formattedSavings = savings.toLocaleString('en-IN');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans max-w-md mx-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-slate-100">
        <button
          onClick={() => navigateTo('home')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Home</span>
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Nudge Preview
        </span>
        <div className="w-8" />
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            Smart Nudge Notification
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed">
            SwipeSafe sends a nudge 3 days before your due date. Instead of dry alerts, it shows you the exact money saved by paying in full.
          </p>
        </div>

        {/* Lock Screen Mockup Container */}
        <div className="w-full max-w-xs mx-auto bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden aspect-[9/16] relative flex flex-col justify-between p-4 font-sans select-none">
          {/* Top Speaker/Camera notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-10" />

          {/* Status Bar */}
          <div className="flex justify-between items-center text-[10px] text-white/80 font-bold px-2.5 pt-1.5">
            <span>21:42</span>
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Time / Date Display */}
          <div className="text-center pt-8 space-y-1">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">21:42</h1>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Saturday, July 25
            </p>
          </div>

          {/* Notification Card */}
          <div className="flex-1 flex flex-col justify-center px-1">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 space-y-2 animate-bounce">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 bg-indigo-600 rounded-md flex items-center justify-center text-white font-extrabold text-[10px]">
                    S
                  </div>
                  <span className="text-xs font-black text-slate-800">SwipeSafe 🛡️</span>
                </div>
                <span className="text-[9px] font-semibold text-slate-400">now</span>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-[11px] font-extrabold text-slate-800">
                  Bill Due in 3 Days!
                </h4>
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                  Your outstanding: <strong className="text-slate-800">₹{formattedOutstanding}</strong>.<br />
                  Paying in full saves you{' '}
                  <strong className="text-rose-600 font-bold">₹{formattedSavings} in interest</strong> vs. paying the minimum. Swipe to pay off instantly!
                </p>
              </div>
            </div>
          </div>

          {/* Unlock hint at bottom */}
          <div className="text-center pb-2 text-[9px] font-bold text-white/50 tracking-wider">
            Swipe up to unlock
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-4">
        <button
          onClick={() => navigateTo('home')}
          className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 text-sm"
        >
          <CheckCircle2 className="h-4.5 w-4.5" />
          <span>Done (Back to Dashboard)</span>
        </button>
      </div>
    </div>
  );
};
