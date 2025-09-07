import React from 'react';
import { SortField } from '@/app/utils/sortHelpers';

interface SortableTableHeaderProps {
  field: SortField;
  children: React.ReactNode;
  onSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => string;
  className?: string;
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  field,
  children,
  onSort,
  getSortIcon,
  className = "px-4 py-3 text-left text-sm font-medium text-[var(--neutral-200)]"
}) => {
  const sortIcon = getSortIcon(field);
  
  return (
    <th 
      className={`${className} cursor-pointer hover:bg-[var(--neutral-40)] transition-colors select-none`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <div className="ml-2 flex flex-col items-center justify-center w-4">
          {sortIcon ? (
            <span className="text-[var(--primary-40)]  text-xl">
              {sortIcon}
            </span>
          ) : (
            <div className="flex flex-col">
              <span className="text-[var(--neutral-40)] text-xs leading-none">△</span>
              <span className="text-[var(--neutral-40)] text-xs leading-none">▾</span>
            </div>
          )}
        </div>
      </div>
    </th>
  );
};

export default SortableTableHeader; 