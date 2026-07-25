import React from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { VerdictBadge } from '../components/VerdictBadge';
import { UtilizationBar } from '../components/UtilizationBar';
import { ExpandableReasoning } from '../components/ExpandableReasoning';
import { ArrowLeft, TrendingDown, Landmark, Sparkles } from 'lucide-react';

export const VerdictScreen: React.FC = () => {
  const { lastCheckAmount, lastCheckResult, confirmPurchase, cancelPurchase, navigateTo } = useCardProfile();

  if (!lastCheckResult || lastCheckAmount <= 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-50 text-slate-500 font-sans max-w-md mx-auto">
        <p className="font-bold mb-4">No active check result found.</p>
        <button
          onClick={cancelPurchase}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    verdict,
    utilizationBefore,
    utilizationAfter,
    interestCost,
    minimumDueTrapCost,
    monthsToPayTrap,
    scoreImpact,
    reasoning
  } = lastCheckResult;

  const formattedAmount = lastCheckAmount.toLocaleString('en-IN');
  const formattedInterest = Math.round(interestCost).toLocaleString('en-IN');
  const formattedTrap = Math.round(minimumDueTrapCost).toLocaleString('en-IN');

  const getScoreImpactColor = (val: number) => {
    if (val > 0) return 'text-emerald-600';
    if (val < 0) return 'text-rose-600';
    return 'text-slate-600';
  };

  const getScoreImpactText = (val: number) => {
    if (val > 0) return `+${val} Points`;
    if (val < 0) return `${val} Points`;
    return 'Neutral (0)';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans max-w-md mx-auto pb-28">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-slate-100">
        <button
          onClick={cancelPurchase}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel</span>
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Verdict
        </span>
        <div className="w-8" />
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 space-y-5">
        {/* Large badge container */}
        <div className="text-center py-4 space-y-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Purchase Amount: ₹{formattedAmount}
          </p>
          <VerdictBadge verdict={verdict} size="lg" />
        </div>

        {/* Utilization Shift Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
            Utilization Shift
          </h4>
          <UtilizationBar before={utilizationBefore} after={utilizationAfter} showLabels={true} />
        </div>

        {/* Shock Callouts */}
        {verdict !== 'blocked' && (
          <div className="grid grid-cols-2 gap-4">
            {/* Score Impact */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Est. Score Impact
                </span>
                <span className={`text-xl font-extrabold tracking-tight block ${getScoreImpactColor(scoreImpact)}`}>
                  {getScoreImpactText(scoreImpact)}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold uppercase mt-3 tracking-wide">
                Simulated Estimate
              </p>
            </div>

            {/* Interest cost */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Cycle Interest Cost
                </span>
                <span className="text-xl font-extrabold text-slate-800 tracking-tight block">
                  ₹{formattedInterest}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-semibold uppercase mt-3 tracking-wide">
                If not paid in full
              </p>
            </div>
          </div>
        )}

        {/* Expandable Reasoning Card */}
        <ExpandableReasoning reasoning={reasoning} defaultExpanded={true} />

        {/* Trap Warning Section (Shown when paying minimum is a concern) */}
        {verdict !== 'blocked' && verdict !== 'safe' && (
          <div className="border border-rose-100 bg-rose-50/20 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <TrendingDown className="h-5 w-5 shrink-0" />
              <h4 className="font-extrabold text-sm uppercase tracking-wide">
                Minimum Payoff Trap
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              If you only pay the minimum due monthly, this ₹{formattedAmount} purchase will compound and cost you{' '}
              <strong className="text-rose-600 font-black">₹{formattedTrap} in interest</strong> alone, taking{' '}
              <strong className="text-rose-600 font-black">{monthsToPayTrap} months</strong> to clear!
            </p>

            <button
              onClick={() => navigateTo('payoff-plan')}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold transition-all border border-rose-100 flex items-center justify-center gap-1.5"
            >
              <Landmark className="h-4 w-4" />
              <span>See Detailed Payoff Comparison</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer CTAs (Responsive & Tappable) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-slate-100 z-30 shadow-md">
        {verdict === 'risky' || verdict === 'blocked' ? (
          // Risky or Blocked Layout: Encourage debit/cancellation
          <div className="flex flex-col gap-2.5">
            <button
              onClick={cancelPurchase}
              className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1 text-sm shadow-md"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>I'll Use Debit Instead</span>
            </button>
            {verdict !== 'blocked' && (
              <button
                onClick={confirmPurchase}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold underline transition-colors"
              >
                Confirm Purchase Anyway
              </button>
            )}
          </div>
        ) : (
          // Safe or Caution Layout: standard confirmation
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={cancelPurchase}
              className="py-4 px-4 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmPurchase}
              className="py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all text-sm shadow-lg shadow-indigo-600/10"
            >
              Confirm Purchase
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
