
'use client';

import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  rightAdornment?: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, rightAdornment, className }) => {
  return (
    <div className={`bg-[var(--neutral-50)] p-6 rounded-lg border border-[var(--neutral-30)] ${className ?? ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-[var(--neutral-700)] font-medium">{title}</h3>
        {rightAdornment ? <div className="flex items-center gap-2">{rightAdornment}</div> : null}
      </div>
      <div className="h-[320px] bg-white rounded-md p-3">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;


