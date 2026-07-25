import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: 'safe' | 'caution' | 'risky' | 'blocked';
  size?: 'sm' | 'md' | 'lg';
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md' }) => {
  const config = {
    safe: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 glow-safe',
      icon: CheckCircle2,
      label: 'Safe to Swipe',
      indicatorColor: 'bg-emerald-500'
    },
    caution: {
      color: 'bg-amber-50 text-amber-700 border-amber-200 glow-caution',
      icon: AlertTriangle,
      label: 'Pay in Full This Cycle',
      indicatorColor: 'bg-amber-500'
    },
    risky: {
      color: 'bg-rose-50 text-rose-700 border-rose-200 glow-risky',
      icon: AlertCircle,
      label: 'Risky — Consider Debit Instead',
      indicatorColor: 'bg-rose-500'
    },
    blocked: {
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: ShieldAlert,
      label: 'Credit Limit Exceeded',
      indicatorColor: 'bg-slate-500'
    }
  };

  const current = config[verdict] || config.caution;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs border rounded-full font-medium gap-1.5',
    md: 'px-4 py-2 text-sm border rounded-full font-semibold gap-2',
    lg: 'px-6 py-3.5 text-base border rounded-2xl font-bold gap-2.5 shadow-sm'
  };

  return (
    <div className={`inline-flex items-center justify-center ${current.color} ${sizeClasses[size]}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${current.indicatorColor} animate-pulse`} />
      <Icon className={`${size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
      <span>{current.label}</span>
    </div>
  );
};
