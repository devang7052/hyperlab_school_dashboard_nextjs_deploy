'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string; // For applying styles to the main button
  showAll?: boolean; // New prop to indicate if 'All' option should be shown
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
  options, 
  value, 
  onChange, 
  placeholder,
  className,
  showAll = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayedOptions = showAll ? [{ value: '', label: 'All' }, ...options] : options;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        className="px-3 py-2 w-32 rounded-md bg-[var(--primary-500)] text-[var(--background)] focus:outline-none flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabel}
        <svg 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute z-10 w-32 bg-white rounded-md shadow-lg focus:outline-none max-h-40 overflow-auto transition-all duration-200 ease-out transform ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}`}>

          
          {/* Options */}
          {displayedOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-lg text-[var(--neutral-200)] font-['Manrope'] cursor-pointer border-b border-[var(--neutral-40)] hover:bg-gray-100 last:border-b-0 last:rounded-b-md"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 