import React, { useEffect, useState } from 'react';

interface UtilizationBarProps {
  before: number; // between 0 and 1
  after: number;  // between 0 and 1
  showLabels?: boolean;
}

export const UtilizationBar: React.FC<UtilizationBarProps> = ({
  before,
  after,
  showLabels = true
}) => {
  const [animatedAfter, setAnimatedAfter] = useState(before);

  useEffect(() => {
    // Small timeout to trigger transition
    const timer = setTimeout(() => {
      setAnimatedAfter(after);
    }, 150);
    return () => clearTimeout(timer);
  }, [after, before]);

  const beforePct = Math.round(before * 100);
  const afterPct = Math.round(animatedAfter * 100);
  const diffPct = Math.max(0, afterPct - beforePct);

  // Determine bar color based on ending utilization
  const getBarColor = (val: number) => {
    if (val <= 0.3) return 'bg-emerald-500';
    if (val <= 0.5) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const currentBarColor = getBarColor(after);

  return (
    <div className="w-full">
      {/* Percentage Labels */}
      {showLabels && (
        <div className="flex justify-between items-baseline mb-2 text-xs font-semibold text-slate-500">
          <div>
            Current: <span className="text-slate-800 text-sm font-bold">{beforePct}%</span>
          </div>
          {diffPct > 0 && (
            <div className="text-slate-800 text-sm font-bold">
              After swipe: <span className={after > 0.5 ? 'text-rose-600' : after > 0.3 ? 'text-amber-600' : 'text-emerald-600'}>{Math.round(after * 100)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div className="relative h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
        {/* Before utilization portion */}
        <div
          className="absolute top-0 left-0 h-full bg-slate-400 opacity-60 rounded-l-full transition-all duration-500"
          style={{ width: `${beforePct}%` }}
        />

        {/* Added utilization portion (animated) */}
        {diffPct > 0 && (
          <div
            className={`absolute top-0 h-full ${currentBarColor} opacity-90 transition-all duration-1000 ease-out`}
            style={{
              left: `${beforePct}%`,
              width: `${diffPct}%`
            }}
          >
            {/* Striped overlay for the pending purchase */}
            <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-[shimmer_1s_infinite_linear]" />
          </div>
        )}

        {/* 30% Healthy marker line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-slate-300 z-10"
          style={{ left: '30%' }}
        />

        {/* 50% High Risk marker line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-slate-400 z-10"
          style={{ left: '50%' }}
        />
      </div>

      {/* Threshold Legends */}
      <div className="relative flex justify-between mt-2.5 px-0.5 text-[10px] font-bold text-slate-400 select-none">
        <div className="w-12 text-left">0%</div>
        
        {/* 30% Legend */}
        <div className="absolute flex flex-col items-center" style={{ left: '30%', transform: 'translateX(-50%)' }}>
          <div className="h-1.5 w-[2px] bg-slate-300 mb-1" />
          <span className="text-slate-500">30% Healthy</span>
        </div>

        {/* 50% Legend */}
        <div className="absolute flex flex-col items-center" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="h-1.5 w-[2px] bg-slate-400 mb-1" />
          <span className="text-slate-600">50% High Risk</span>
        </div>

        <div className="w-12 text-right">100%</div>
      </div>
    </div>
  );
};
