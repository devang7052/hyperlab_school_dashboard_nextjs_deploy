'use client';

import React from 'react';
import { KhelegySurveyResponse } from '../../models/khelegySurvey';
import SurveyStatisticsCards from './SurveyStatisticsCards';
import ParticipationByAgePie from './charts/ParticipationByAgePie';
import ParticipationBySchoolTypeBar from './charts/ParticipationBySchoolTypeBar';
import ParticipationByGradeBar from './charts/ParticipationByGradeBar';
import EquityByReligionCaste from './charts/EquityByReligionCaste';
import SportsFrequencyBar from './charts/SportsFrequencyBar';
import OverallParticipationDonut from './charts/OverallParticipationDonut';
import FrequencyByAgeGrouped from './charts/FrequencyByAgeGrouped';
import DropoutReasonsBar from './charts/DropoutReasonsBar';
import DiscontinuationYearHistogram from './charts/DiscontinuationYearHistogram';

interface AnalyticsViewProps {
  surveys: KhelegySurveyResponse[];
  isLoading: boolean;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ surveys, isLoading }) => {
  
  // Calculate basic analytics
  const totalResponses = surveys.length;

  const sportsParticipationDistribution = surveys.reduce((acc, survey) => {
    const status = survey.sportsParticipationStatus.split('.').pop() || '';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--neutral-400)]">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <SurveyStatisticsCards surveys={surveys} />

      {/* Participation & Dropout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverallParticipationDonut surveys={surveys} />
        <ParticipationByAgePie surveys={surveys} />
        <ParticipationBySchoolTypeBar surveys={surveys} />
      </div>

      <ParticipationByGradeBar surveys={surveys} />

      {/* Equity Gaps */}
      <EquityByReligionCaste surveys={surveys} />

      {/* Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SportsFrequencyBar surveys={surveys} />
        <FrequencyByAgeGrouped surveys={surveys} />
      </div>

      {/* Dropout When/Why - Currently showing placeholders since dropout data isn't mapped in the new service */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiscontinuationYearHistogram surveys={surveys} />
        <DropoutReasonsBar surveys={surveys} />
      </div>

      {/* Sports Participation Status */}
      <div className="bg-[var(--neutral-50)] p-6 rounded-lg border border-[var(--neutral-30)]">
        <h3 className="text-lg text-[var(--neutral-700)] font-medium mb-4">
          Sports Participation Status
        </h3>
        <div className="space-y-3">
          {Object.entries(sportsParticipationDistribution).map(([status, count]) => {
            const percentage = ((count / totalResponses) * 100).toFixed(1);
            const getStatusColor = (status: string) => {
              switch (status) {
                case 'active': return 'bg-[var(--primary-500)]';
                case 'irregular': return 'bg-[var(--primary-400)]';
                case 'dropout': return 'bg-[var(--error-500)]';
                case 'returnee': return 'bg-[var(--secondary-400)]';
                default: return 'bg-[var(--neutral-500)]';
              }
            };
            
            return (
              <div key={status} className="flex items-center justify-between">
                <span className="text-[var(--neutral-700)] capitalize">{status}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-[var(--neutral-20)] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-[var(--neutral-600)] text-sm w-12 text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing lists retained below if needed */}

    </div>
  );
};

export default AnalyticsView;
