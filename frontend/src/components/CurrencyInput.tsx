import React, { useState, useEffect, useRef } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '0',
  autoFocus = false,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount if autoFocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small timeout for iOS/Chrome autoFocus reliability
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Sync state if value changes from outside
  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      const formatted = value.toLocaleString('en-IN');
      setDisplayValue(formatted);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    
    // Remove all non-digits (except optional decimal but we deal with integers for simplicity)
    const digitsOnly = rawInput.replace(/[^\d]/g, '');
    
    if (digitsOnly === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numValue = parseInt(digitsOnly, 10);
    
    // Format to Indian Rupees standard comma separators
    const formatted = numValue.toLocaleString('en-IN');
    setDisplayValue(formatted);
    onChange(numValue);
  };

  return (
    <div className={`relative flex items-center justify-center font-bold text-slate-800 ${className}`}>
      <span className="text-3xl mr-1 text-slate-400 select-none">₹</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full text-center bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none px-2 py-1 text-4xl font-extrabold text-slate-800 transition-colors placeholder:text-slate-300"
      />
    </div>
  );
};
