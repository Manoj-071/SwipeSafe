import React from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { UtilizationBar } from '../components/UtilizationBar';
import { getDaysLeftInCycle } from '../lib/calculator';
import { CreditCard, PlusCircle, Bell, ArrowUpRight, ArrowDownLeft, CheckCircle2, History, RotateCcw } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { activeProfile, navigateTo, resetCycle, resetAll } = useCardProfile();

  if (!activeProfile) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-50 text-slate-500 font-sans max-w-md mx-auto">
        <CreditCard className="h-12 w-12 text-slate-300 mb-4 animate-bounce" />
        <p className="font-bold text-sm mb-4">No active credit card profile loaded.</p>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Initialize Onboarding
        </button>
      </div>
    );
  }

  const { cardLimit, outstandingBalance, dueDate, purchaseHistory, repaymentPattern } = activeProfile;
  const availableCredit = Math.max(0, cardLimit - outstandingBalance);
  const currentUtil = cardLimit > 0 ? outstandingBalance / cardLimit : 0;
  const daysLeft = getDaysLeftInCycle(dueDate);

  // Formatting helper
  const fmt = (num: number) => Math.abs(num).toLocaleString('en-IN');

  const getRepaymentLabel = (pattern: string) => {
    switch (pattern) {
      case 'full': return 'Pays in Full';
      case 'minimum': return 'Pays Minimum';
      default: return 'Depends / Partial';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans max-w-md mx-auto pb-24 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm">
            S
          </div>
          <span className="font-extrabold text-slate-800 text-lg">SwipeSafe</span>
        </div>
        <button
          onClick={() => navigateTo('nudge')}
          className="p-2.5 bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all border border-slate-100 flex items-center gap-1.5 text-xs font-bold"
          title="Preview Nudge"
        >
          <Bell className="h-4 w-4" />
          <span>Nudge</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="p-5 space-y-5">
        {/* Card Mockup */}
        <div className="premium-gradient text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-48 select-none">
          {/* Top Info */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Card Profile
              </p>
              <h3 className="text-sm font-bold text-white/90">
                {getRepaymentLabel(repaymentPattern)}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold bg-indigo-500/30 text-teal-300 px-3 py-1 rounded-full border border-indigo-400/20">
                Active
              </span>
            </div>
          </div>

          {/* Outstanding Balance */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Outstanding Balance
            </p>
            <h2 className="text-3xl font-black tracking-tight">
              ₹{fmt(outstandingBalance)}
            </h2>
          </div>

          {/* Bottom Card Row */}
          <div className="flex justify-between items-center text-xs font-medium text-slate-300 border-t border-slate-700/50 pt-3">
            <div>
              Limit: <span className="font-bold text-white">₹{fmt(cardLimit)}</span>
            </div>
            <div>
              Available: <span className="font-bold text-teal-300">₹{fmt(availableCredit)}</span>
            </div>
          </div>
        </div>

        {/* Credit Utilization Status */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Credit Utilization
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              currentUtil <= 0.3 ? 'bg-emerald-50 text-emerald-700' : currentUtil <= 0.5 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {currentUtil <= 0.3 ? 'Healthy' : currentUtil <= 0.5 ? 'Caution' : 'High Risk'}
            </span>
          </div>

          <UtilizationBar before={currentUtil} after={currentUtil} showLabels={true} />

          {/* Billing Cycle info */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-xs font-medium">
            <span className="text-slate-500">Statement Due Date</span>
            <span className={`font-bold ${daysLeft <= 3 ? 'text-rose-600' : 'text-slate-700'}`}>
              Day {dueDate} ({daysLeft} days left)
            </span>
          </div>
        </div>

        {/* Repayment Simulator Panel */}
        {outstandingBalance > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-indigo-500" />
              <span>Repayment Simulator</span>
            </h4>
            
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Simulate paying your bill before the due date to see utilization restore:
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => resetCycle('full')}
                className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-2xl text-[10px] transition-colors border border-emerald-100"
              >
                Pay Full<br />(₹{fmt(outstandingBalance)})
              </button>
              <button
                onClick={() => resetCycle('minimum')}
                className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-2xl text-[10px] transition-colors border border-amber-100"
              >
                Pay Min (5%)<br />(₹{fmt(Math.max(250, outstandingBalance * 0.05))})
              </button>
              <button
                onClick={() => resetCycle('partial')}
                className="py-2.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-2xl text-[10px] transition-colors border border-slate-100"
              >
                Pay 50%<br />(₹{fmt(outstandingBalance * 0.5)})
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity List */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <History className="h-4 w-4 text-slate-400" />
            <span>Swipe History</span>
          </h4>

          {purchaseHistory.length === 0 ? (
            <div className="text-center py-6 text-slate-400 space-y-2">
              <CheckCircle2 className="h-8 w-8 mx-auto text-slate-200" />
              <p className="text-xs font-bold">No swipes recorded yet.</p>
              <p className="text-[10px] text-slate-400 font-medium">Click "Check a Purchase" to make your first simulation.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {purchaseHistory.map((item, idx) => {
                const isRepayment = item.amount < 0;
                return (
                  <div key={idx} className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        isRepayment ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isRepayment ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-slate-800 truncate">
                          {isRepayment ? 'Credit Card Repayment' : `Purchase check (₹${fmt(item.amount)})`}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          {new Date(item.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-extrabold ${isRepayment ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {isRepayment ? '+' : '-'}₹{fmt(item.amount)}
                      </span>
                      {!isRepayment && (
                        <div className="mt-0.5">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.verdict === 'safe'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.verdict === 'caution'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {item.verdict}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Check Purchase Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-slate-50 to-slate-50/10 backdrop-blur-sm z-30 flex justify-center">
        <button
          onClick={() => navigateTo('purchase-check')}
          className="w-full max-w-xs py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 text-sm"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Check a Purchase</span>
        </button>
      </div>
    </div>
  );
};
