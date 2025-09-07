import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  options: FilterOption[];
  selectedValues: string[];
  onOptionChange: (value: string) => void;
  inheritFont?: boolean;
  bold?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  options,
  selectedValues,
  onOptionChange,
  inheritFont = false,
}) => {
  return (
    <div className="mb-6">
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer" 
        onClick={onToggle}
      >
        <h4 className={`text-base text-[var(--neutral-500)] ${inheritFont ? '' : "font-['MADE_Outer_Sans_Light']"} ml-3`}>{title}</h4>
        <img 
          src="/icons/down_navigation.svg" 
          alt="Toggle" 
          className={`h-4 w-4 mr-1 transition-transform duration-200  ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>
      
      {isExpanded && (
        <div className="space-y-2 ml-3">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onOptionChange(option.value)}
                className="w-3 h-3 text-[var(--primary-500)] bg-[var(--background)] border-[var(--neutral-500)] rounded focus:ring-[var(--primary-500)] focus:ring-2"
              />
              <span className={`ml-3 text-base ${inheritFont ? '' : "font-['MADE_Outer_Sans_Light']"} text-[var(--neutral-400)]`}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection; 