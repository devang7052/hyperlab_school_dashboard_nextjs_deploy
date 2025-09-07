import React from 'react';
import { KhelegySurveyResponse } from '../../models/khelegySurvey';

interface SurveyStats {
  totalResponses: number;
  completionRate: number;
}

// Note: Form question counts could be used in future for dynamic completion rate calculation

interface SurveyStatisticsCardsProps {
  surveys: KhelegySurveyResponse[];
}

const SurveyStatisticsCards: React.FC<SurveyStatisticsCardsProps> = ({ surveys }) => {
  
  // Calculate statistics from survey data
  const surveyStats: SurveyStats = {
    totalResponses: surveys.length,
    completionRate: calculateCompletionRate(surveys),
  };

  // Helper function to calculate completion rate
  function calculateCompletionRate(surveys: KhelegySurveyResponse[]): number {
    if (surveys.length === 0) return 0;

    // Count completed questions for each survey
    const completedCounts = surveys.map(survey => {
      // Count non-null and non-undefined fields
      const completedFields = Object.entries(survey).filter(([key, value]) => {
        // Skip metadata fields and optional fields
        const skipFields = ['id', 'email', 'casteCommunity', 'menarcheStatus', 'menstrualProductUse', 'createdAt', 'updatedAt'];
        return !skipFields.includes(key) && value !== null && value !== undefined;
      }).length;

      return completedFields;
    });

    // Calculate average completion rate
    const totalExpectedQuestions = 29; // Using the minimum question count as baseline
    const averageCompletion = (completedCounts.reduce((a, b) => a + b, 0) / surveys.length) / totalExpectedQuestions;
    
    return Math.round(averageCompletion * 100);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[var(--neutral-50)] p-6 rounded-lg border border-[var(--neutral-30)]">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[var(--primary-500)] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">{surveyStats.totalResponses}</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm text-[var(--neutral-700)]">Total Responses</p>
            <p className="text-2xl text-[var(--neutral-800)] font-semibold">{surveyStats.totalResponses}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--neutral-50)] p-6 rounded-lg border border-[var(--neutral-30)]">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[var(--primary-500)] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">%</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm text-[var(--neutral-700)]">Completion Rate</p>
            <p className="text-2xl text-[var(--neutral-800)] font-semibold">{surveyStats.completionRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyStatisticsCards;
