import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface ExpandableReasoningProps {
  reasoning: string;
  defaultExpanded?: boolean;
}

export const ExpandableReasoning: React.FC<ExpandableReasoningProps> = ({
  reasoning,
  defaultExpanded = true
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2 font-semibold text-sm">
          <HelpCircle className="h-4 w-4 text-indigo-500" />
          <span>Why is this the verdict?</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>
      
      {/* Collapsible Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'max-h-60 border-t border-slate-50 opacity-100 p-4' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          {reasoning}
        </p>
      </div>
    </div>
  );
};
