import React, { useState } from 'react';
import SurveyChart from './SurveyChart';
import { KhelegySurveyResponse } from '../../models/khelegySurvey';

interface SurveyOverviewProps {
  surveys: KhelegySurveyResponse[];
}

const SurveyOverview: React.FC<SurveyOverviewProps> = ({ surveys }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'government' | 'private'>('all');

  const surveyMetrics = [
    'Sports Participation',
    'Age Distribution',
    'Performance Indices',
  ];

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-3 mt-3">
        <h2 className="text-3xl font-['Manrope'] text-[var(--neutral-500)]">Survey Analytics Overview</h2>
        
        {/* Filter buttons */}
        <div className="flex rounded-lg p-1">
          {[
            { key: 'all', label: 'All Schools' },
            { key: 'government', label: 'Government' },
            { key: 'private', label: 'Private' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key as 'all' | 'government' | 'private')}
              className={`px-4 py-2 rounded-md text-sm ml-2 font-['Manrope'] transition-colors ${
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
          {surveyMetrics.map((metricName) => (
            <SurveyChart 
              key={metricName} 
              metricName={metricName} 
              surveys={surveys} 
              selectedFilter={selectedFilter} 
            />
          ))}
        </div>
      </div>

      {surveys.length === 0 && (
        <div className="text-center py-12 text-[var(--neutral-500)]">
          No survey data available to display
        </div>
      )}
    </section>
  );
};

export default SurveyOverview;
