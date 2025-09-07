'use client';

import React, { useState } from 'react';
import { KhelegySurveyResponse } from '../../models/khelegySurvey';
import LoadingSpinner from '../../components/common/loadingSpinner';
import { SurveyFilterState } from '../../hooks/khelegi/khelegiTable/useSurveyFilters';
import { SurveySortField } from '../../hooks/khelegi/khelegiTable/useSurveySorting';

interface SurveyResponsesTableProps {
  surveys: KhelegySurveyResponse[];
  loadMoreSurveys: () => void;
  hasMoreSurveys: boolean;
  filterState: SurveyFilterState;
  setFilterValue: (field: keyof SurveyFilterState, value: string) => void;
  isLoading: boolean;
  error: Error | null;
  isFetchingMore?: boolean;
  // Sorting props
  handleSort: (field: SurveySortField) => void;
  getSortIconForField: (field: SurveySortField) => string;
  isSorting: boolean;
  // Pagination info
  currentPage: number;
  totalItems: number;
}

// Helper function to format enum values for display
const formatEnumValue = (value: string): string => {
  if (!value) return '-';
  
  // For school types, religions, caste/community, education, occupation, sports status, and menstrual health that are now raw values, return as-is
  if (value.includes('Board') || value === 'ICSE' || value === 'CBSE' || value === 'IB' || value === 'IGCSE' ||
      value === 'Hindu' || value === 'Muslim' || value === 'Christian' || value === 'Sikh' || 
      value === 'Jain' || value === 'Buddhist' || value === "Don't know" || value === 'Other:' ||
      value === 'Scheduled Tribe' || value === 'Scheduled Caste' || value === 'General' ||
      value.includes('formal education') || value.includes('(') || // Education patterns
      value === 'Government Service' || value === 'Private Job' || value === 'Daily Wage / Labor' ||
      value === 'Business' || value === 'Farmer' || value === 'Homemaker' || value === 'Unemployed' ||
      value === "Don't Know" || value === 'Other' ||
      value.includes('Active/') || value === 'Dropout' || value === 'Returnee' || value === 'Never played' || value === 'Cannot determine' ||
      value.includes('menarche') || value === 'None' || // Menarche status
      value === 'Sanitary Pads' || value === 'Cloth' || value === 'Menstrual Cup' || value === 'Tampon' ||
      value === 'Period Panties' || value === 'Nothing') {
    return value;
  }
  
  // Remove enum prefix and convert to readable format for other fields
  const formatted = value.split('.').pop() || value;
  return formatted
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Helper function to get display value for various fields
const getDisplayValue = (survey: KhelegySurveyResponse, field: string): string => {
  switch (field) {
    case 'name':
      return survey.name;
    case 'email':
      return survey.email || '-';
    case 'ageGroup':
      return formatEnumValue(survey.ageGroup);
    case 'schoolType':
      return formatEnumValue(survey.schoolType);
    case 'religion':
      return formatEnumValue(survey.religion);
    case 'casteCommunity':
      return survey.casteCommunity ? formatEnumValue(survey.casteCommunity) : '-';
    case 'parentalEducation':
      return formatEnumValue(survey.parentalEducation);
    case 'parentalOccupation':
      return formatEnumValue(survey.parentalOccupation);
    case 'sportsParticipationStatus':
      return formatEnumValue(survey.sportsParticipationStatus);
    case 'sportsFrequency':
      return formatEnumValue(survey.sportsFrequency);
    case 'menarcheStatus':
      return survey.menarcheStatus ? formatEnumValue(survey.menarcheStatus) : '-';
    case 'menstrualProductUse':
      return survey.menstrualProductUse ? formatEnumValue(survey.menstrualProductUse) : '-';
    case 'surveyCompletedAt':
      return new Date(survey.surveyCompletedAt).toLocaleDateString();
    default:
      return '-';
  }
};

// Filter options for dropdowns (kept for future use)
// const getFilterOptions = (field: string): { value: string; label: string }[] => {
//   const baseOptions = [{ value: '', label: 'All' }];
//   
//   switch (field) {
//     case 'ageGroup':
//       return [
//         ...baseOptions,
//         { value: 'AgeGroup.8to12', label: '8-12 years' },
//         { value: 'AgeGroup.12to17', label: '12-17 years' },
//         { value: 'AgeGroup.18to27', label: '18-27 years' },
//         { value: 'AgeGroup.parent', label: 'Parent' },
//       ];
//     case 'schoolType':
//       return [
//         ...baseOptions,
//         { value: 'State Board govt funded', label: 'State Board govt funded' },
//         { value: 'State Board self funded', label: 'State Board self funded' },
//         { value: 'ICSE', label: 'ICSE' },
//         { value: 'CBSE', label: 'CBSE' },
//         { value: 'IB', label: 'IB' },
//         { value: 'IGCSE', label: 'IGCSE' },
//       ];
//     case 'religion':
//       return [
//         ...baseOptions,
//         { value: 'Hindu', label: 'Hindu' },
//         { value: 'Muslim', label: 'Muslim' },
//         { value: 'Christian', label: 'Christian' },
//         { value: 'Sikh', label: 'Sikh' },
//         { value: 'Jain', label: 'Jain' },
//         { value: 'Buddhist', label: 'Buddhist' },
//         { value: "Don't know", label: "Don't know" },
//         { value: 'Other:', label: 'Other' },
//       ];
//     case 'casteCommunity':
//       return [
//         ...baseOptions,
//         { value: 'Scheduled Tribe', label: 'Scheduled Tribe' },
//         { value: 'Scheduled Caste', label: 'Scheduled Caste' },
//         { value: 'General', label: 'General' },
//         { value: "Don't know", label: "Don't know" },
//         { value: 'Other:', label: 'Other' },
//       ];
//     case 'parentalEducation':
//       return [
//         ...baseOptions,
//         { value: 'No formal education', label: 'No formal education' },
//         { value: 'Primary (1st-5th)', label: 'Primary (1st-5th)' },
//         { value: 'Secondary (6th–10th)', label: 'Secondary (6th–10th)' },
//         { value: 'Higher secondary (11th–12th)', label: 'Higher secondary (11th–12th)' },
//         { value: 'Graduate', label: 'Graduate' },
//         { value: 'Postgraduate', label: 'Postgraduate' },
//       ];
//     case 'parentalOccupation':
//       return [
//         ...baseOptions,
//         { value: 'Government Service', label: 'Government Service' },
//         { value: 'Private Job', label: 'Private Job' },
//         { value: 'Daily Wage / Labor', label: 'Daily Wage / Labor' },
//         { value: 'Business', label: 'Business' },
//         { value: 'Farmer', label: 'Farmer' },
//         { value: 'Homemaker', label: 'Homemaker' },
//         { value: 'Unemployed', label: 'Unemployed' },
//         { value: 'Don\'t Know', label: 'Don\'t Know' },
//         { value: 'Other', label: 'Other' },
//       ];
//     case 'sportsParticipationStatus':
//       return [
//         ...baseOptions,
//         { value: 'Active/Regular', label: 'Active/Regular' },
//         { value: 'Active/Irregular', label: 'Active/Irregular' },
//         { value: 'Dropout', label: 'Dropout' },
//         { value: 'Returnee', label: 'Returnee' },
//         { value: 'Never played', label: 'Never played' },
//         { value: 'Cannot determine', label: 'Cannot determine' },
//       ];
//     case 'sportsFrequency':
//       return [
//         ...baseOptions,
//         { value: 'SportsFrequency.daily', label: 'Daily' },
//         { value: 'SportsFrequency.weekly', label: 'Weekly' },
//         { value: 'SportsFrequency.monthly', label: 'Monthly' },
//         { value: 'SportsFrequency.none', label: 'None' },
//       ];
//     case 'menarcheStatus':
//       return [
//         ...baseOptions,
//         { value: 'Pre-menarche', label: 'Pre-menarche' },
//         { value: 'Post-menarche', label: 'Post-menarche' },
//         { value: 'None', label: 'None' },
//       ];
//     case 'menstrualProductUse':
//       return [
//         ...baseOptions,
//         { value: 'Sanitary Pads', label: 'Sanitary Pads' },
//         { value: 'Cloth', label: 'Cloth' },
//         { value: 'Menstrual Cup', label: 'Menstrual Cup' },
//         { value: 'Tampon', label: 'Tampon' },
//         { value: 'Period Panties', label: 'Period Panties' },
//         { value: 'Nothing', label: 'Nothing' },
//         { value: 'Other:', label: 'Other' },
//       ];
//     default:
//       return baseOptions;
//   }
// };

const SurveyResponsesTable: React.FC<SurveyResponsesTableProps> = ({
  surveys,
  loadMoreSurveys,
  hasMoreSurveys,
  isLoading,
  error,
  isFetchingMore = false,
  // Sorting props
  handleSort,
  getSortIconForField,
}) => {
  
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (surveyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(surveyId)) {
      newExpanded.delete(surveyId);
    } else {
      newExpanded.add(surveyId);
    }
    setExpandedRows(newExpanded);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-[var(--error-500)] mb-4">
          <h3 className="text-lg font-semibold">Error Loading Survey Data</h3>
          <p className="text-sm">{error.message || 'Failed to load survey responses'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Table */}
      <div className="overflow-x-auto border border-[var(--neutral-200)] rounded-lg">
        <table className="min-w-full divide-y divide-[var(--neutral-200)]">
          <thead className="bg-[var(--neutral-50)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider">
                #
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider cursor-pointer hover:bg-[var(--neutral-100)]"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center justify-between">
                  <span>Name</span>
                  <span className="ml-2">{getSortIconForField('name')}</span>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider cursor-pointer hover:bg-[var(--neutral-100)]"
                onClick={() => handleSort('ageGroup')}
              >
                <div className="flex items-center justify-between">
                  <span>Age Group</span>
                  <span className="ml-2">{getSortIconForField('ageGroup')}</span>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider cursor-pointer hover:bg-[var(--neutral-100)]"
                onClick={() => handleSort('schoolType')}
              >
                <div className="flex items-center justify-between">
                  <span>School Type</span>
                  <span className="ml-2">{getSortIconForField('schoolType')}</span>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider cursor-pointer hover:bg-[var(--neutral-100)]"
                onClick={() => handleSort('sportsParticipationStatus')}
              >
                <div className="flex items-center justify-between">
                  <span>Sports Status</span>
                  <span className="ml-2">{getSortIconForField('sportsParticipationStatus')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[var(--neutral-400)] uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--background)] divide-y divide-[var(--neutral-200)]">
            {surveys.map((survey, index) => (
              <React.Fragment key={survey.id}>
                {/* Main Row */}
                <tr className="hover:bg-[var(--neutral-50)] transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--neutral-100)]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[var(--neutral-100)]">
                    {getDisplayValue(survey, 'name')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--neutral-100)]">
                    {getDisplayValue(survey, 'ageGroup')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--neutral-100)]">
                    {getDisplayValue(survey, 'schoolType')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--neutral-100)]">
                    {getDisplayValue(survey, 'sportsParticipationStatus')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[var(--neutral-100)]">
                    <button
                      onClick={() => toggleRowExpansion(survey.id!)}
                      className="text-[var(--primary-500)] hover:text-[var(--primary-600)] focus:outline-none"
                    >
                      {expandedRows.has(survey.id!) ? '▾' : '▸'}
                    </button>
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRows.has(survey.id!) && (
                  <tr className="bg-[var(--neutral-25)]">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Email:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'email')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Religion:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'religion')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Caste/Community:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'casteCommunity')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Parental Education:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'parentalEducation')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Parental Occupation:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'parentalOccupation')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Sports Frequency:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'sportsFrequency')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-[var(--neutral-400)]">Survey Completed:</span>
                          <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'surveyCompletedAt')}</span>
                        </div>
                        {survey.menarcheStatus && (
                          <div>
                            <span className="font-medium text-[var(--neutral-400)]">Menarche Status:</span>
                            <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'menarcheStatus')}</span>
                          </div>
                        )}
                        {survey.menstrualProductUse && (
                          <div>
                            <span className="font-medium text-[var(--neutral-400)]">Menstrual Product:</span>
                            <span className="ml-2 text-[var(--neutral-100)]">{getDisplayValue(survey, 'menstrualProductUse')}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMoreSurveys && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMoreSurveys}
            disabled={isFetchingMore}
            className="px-6 py-2 bg-[var(--primary-500)] text-white rounded-md hover:bg-[var(--primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {surveys.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-[var(--neutral-400)]">
            <h3 className="text-lg font-semibold mb-2">No Survey Responses Found</h3>
            <p>No survey responses match your current filters.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponsesTable;
