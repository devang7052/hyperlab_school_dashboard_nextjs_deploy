import React, { useState } from 'react';
import TestChart from './testChart';
import { HomeTestData } from '@/app/models/helpers/homeTypes';
import { DashboardConfig } from '@/app/utils/dashboardConfig';

interface TestStatisticsChartProps {
  testGradstats: HomeTestData;
  config: DashboardConfig;
}

const TestStatisticsChart: React.FC<TestStatisticsChartProps> = ({ testGradstats, config }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'male' | 'female'>('all');

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-3 mt-3">
        <h2 className="text-3xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] ">  {config.terminology.overviewTitle}</h2>
        
        {/* Filter buttons */}
        <div className="flex  rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'male', label: 'Male' },
            { key: 'female', label: 'Female' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key as 'all' | 'male' | 'female')}
              className={`px-4 py-2 rounded-md text-sm ml-2 font-['MADE_Outer_Sans_Light'] transition-colors ${
                selectedFilter === key
                  ? ' border-2 border-[var(--primary-500)]'
                  : ' border-2 border-[var(--neutral-30)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal scrollable container for charts */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6">
          {Object.entries(testGradstats).map(([testName, testData]) => (
            <TestChart key={testName} testName={testName} testData={testData} selectedFilter={selectedFilter} />
          ))}
        </div>
      </div>

      {Object.keys(testGradstats).length === 0 && (
        <div className="text-center py-12 text-[var(--neutral-500)]">
          No test statistics available to display
        </div>
      )}
    </section>
  );
};

export default TestStatisticsChart;