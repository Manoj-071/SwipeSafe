import React, { useState } from 'react';
import { useCardProfile } from '../context/CardProfileContext';
import { Settings, RefreshCw, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export const DemoModeSelector: React.FC = () => {
  const { loadDemoProfile, resetAll, activeProfile } = useCardProfile();
  const [isOpen, setIsOpen] = useState(false);

  const profiles = [
    {
      name: 'Safe Case (P1)',
      label: 'Low Util / Pay Full',
      icon: CheckCircle,
      color: 'text-emerald-500 hover:bg-emerald-50 border-emerald-100',
      badgeColor: 'bg-emerald-500'
    },
    {
      name: 'Caution Case (P2)',
      label: 'Mid Util / Depends',
      icon: AlertTriangle,
      color: 'text-amber-500 hover:bg-amber-50 border-amber-100',
      badgeColor: 'bg-amber-500'
    },
    {
      name: 'Risky Case (P3)',
      label: 'High Util / Pay Min',
      icon: AlertCircle,
      color: 'text-rose-500 hover:bg-rose-50 border-rose-100',
      badgeColor: 'bg-rose-500'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-wider focus:outline-none border border-slate-700"
      >
        <Settings className={`h-4 w-4 ${isOpen ? 'animate-spin' : ''}`} />
        <span>Demo Panel</span>
        {activeProfile && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
        )}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-72 bg-white rounded-3xl p-4 border border-slate-100 shadow-2xl space-y-3.5 transform origin-bottom-right transition-all duration-300">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>🛠️ Demo Configurations</span>
            </h4>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
              Local Sandbox
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Click any profile to instantly populate SwipeSafe state and test decisions:
          </p>

          <div className="space-y-2">
            {profiles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    loadDemoProfile(idx);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 border rounded-2xl text-left transition-colors ${p.color}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{p.label}</div>
                    </div>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${p.badgeColor}`} />
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={() => {
                resetAll();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Application (Onboard)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
