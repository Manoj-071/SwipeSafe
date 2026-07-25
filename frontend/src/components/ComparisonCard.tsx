import React from 'react';
import { Calendar, Percent, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ComparisonCardProps {
  monthsToPay: number;
  totalInterest: number;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  monthsToPay,
  totalInterest
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Option A: Pay in Full */}
      <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 bg-emerald-500 text-white rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider">
          Recommended
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Pay in Full</h3>
          </div>
          
          <p className="text-slate-500 text-xs mb-4">
            Pay the entire bill by the due date. No interest, no debt accumulation.
          </p>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center py-1.5 border-b border-emerald-50">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Payoff Time</span>
              <span className="text-sm font-bold text-slate-800">1 Month</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-emerald-50">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Percent className="h-3.5 w-3.5" /> Interest Rate</span>
              <span className="text-sm font-bold text-emerald-600">0% APR</span>
            </div>
            <div className="flex justify-between items-center pt-1.5">
              <span className="text-xs text-slate-500">Total Interest Paid</span>
              <span className="text-lg font-black text-emerald-600">₹0</span>
            </div>
          </div>
        </div>

        <div className="mt-5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-lg p-2 text-center">
          Saves you ₹{totalInterest.toLocaleString('en-IN')} in interest!
        </div>
      </div>

      {/* Option B: Pay Minimum Only */}
      <div className="border border-rose-100 bg-rose-50/20 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-5 w-5 text-rose-600" />
            <h3 className="font-bold text-slate-800 text-base">Pay Minimum Due</h3>
          </div>

          <p className="text-slate-500 text-xs mb-4">
            Pay only ~5% of the balance each month. Accrues interest on the rest.
          </p>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center py-1.5 border-b border-rose-50">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Payoff Time</span>
              <span className="text-sm font-bold text-rose-700">{monthsToPay} Months</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-rose-50">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Percent className="h-3.5 w-3.5" /> Interest Rate</span>
              <span className="text-sm font-bold text-rose-600">36% APR</span>
            </div>
            <div className="flex justify-between items-center pt-1.5">
              <span className="text-xs text-slate-500">Total Interest Paid</span>
              <span className="text-lg font-black text-rose-600">₹{totalInterest.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 text-[11px] font-semibold text-rose-700 bg-rose-50 rounded-lg p-2 text-center">
          Warning: Paying minimum is a compounding debt trap!
        </div>
      </div>
    </div>
  );
};
