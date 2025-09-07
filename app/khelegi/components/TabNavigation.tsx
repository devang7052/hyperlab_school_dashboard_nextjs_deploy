'use client';

import React from 'react';

export type KhelegiTab = 'overview' | 'analytics';

interface TabNavigationProps {
  activeTab: KhelegiTab;
  onTabChange: (tab: KhelegiTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'overview' as KhelegiTab, label: 'Overview' },
    { id: 'analytics' as KhelegiTab, label: 'Analytics' },
  ];

  return (
    <div className="border-b border-[var(--neutral-200)] mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-[var(--primary-500)] text-[var(--primary-500)]'
                : 'border-transparent text-[var(--neutral-400)] hover:text-[var(--neutral-100)] hover:border-[var(--neutral-300)]'
              }
            `}
          >
            <span className="font-['MADE_Outer_Sans_Medium']">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
