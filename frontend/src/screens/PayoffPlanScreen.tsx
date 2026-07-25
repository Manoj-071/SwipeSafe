import React from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { ComparisonCard } from '../components/ComparisonCard';
import { simulateMinimumDueTrap } from '../lib/calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BellRing, TrendingUp } from 'lucide-react';

export const PayoffPlanScreen: React.FC = () => {
  const { lastCheckAmount, activeProfile, navigateTo } = useCardProfile();

  if (!activeProfile || lastCheckAmount <= 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-50 text-slate-500 font-sans max-w-md mx-auto">
        <p className="font-bold mb-4">No active check data available.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  const apr = activeProfile.apr || 0.36;
  const trapRes = simulateMinimumDueTrap(lastCheckAmount, apr);

  // Format data for chart (take up to 12 months for readable screen layout)
  const chartData = trapRes.history.slice(0, 12).map((item) => ({
    month: `M${item.month}`,
    Balance: Math.round(item.balanceAfter),
    'Paid Interest': Math.round(trapRes.history.slice(0, item.month).reduce((acc, curr) => acc + curr.interestAdded, 0))
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-slate-100">
        <button
          onClick={() => navigateTo('verdict')}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Verdict</span>
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Payoff Plan
        </span>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 flex-1">
        <div className="space-y-1.5 text-center">
          <h2 className="text-xl font-black text-slate-900 leading-tight flex items-center justify-center gap-1.5">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Repayment Trajectory</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            ₹{lastCheckAmount.toLocaleString('en-IN')} Swipe Simulation
          </p>
        </div>

        {/* Side by side stats */}
        <ComparisonCard
          monthsToPay={trapRes.monthsToPay}
          totalInterest={trapRes.totalInterest}
        />

        {/* Chart Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              12-Month Debt Trajectory
            </h4>
            <p className="text-[10px] text-slate-400 font-medium mt-1">
              Visualizes how outstanding balance crawls down while interest accumulates.
            </p>
          </div>

          {/* Recharts container */}
          <div className="h-56 w-full select-none text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '16px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'sans-serif'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="Balance"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#ef4444' }}
                  name="Unpaid Debt"
                />
                <Line
                  type="monotone"
                  dataKey="Paid Interest"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#f59e0b' }}
                  name="Interest Paid"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 mt-2 border-t border-slate-50 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Remaining Balance (₹)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Interest Accumulation (₹)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Floating CTA Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-slate-50 to-slate-50/10 backdrop-blur-sm z-30 flex justify-center">
        <button
          onClick={() => navigateTo('nudge')}
          className="w-full max-w-xs py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 text-sm"
        >
          <BellRing className="h-4.5 w-4.5 animate-pulse" />
          <span>Set Bill Reminder & Save</span>
        </button>
      </div>
    </div>
  );
};
