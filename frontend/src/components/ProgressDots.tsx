import React from 'react';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ currentStep, totalSteps = 4 }) => {
  return (
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-350 ${
              isActive
                ? 'w-6 bg-indigo-600'
                : isCompleted
                ? 'w-2 bg-indigo-300'
                : 'w-2 bg-slate-200'
            }`}
          />
        );
      })}
    </div>
  );
};
