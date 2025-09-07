'use client';

import { useState, useCallback, useMemo } from 'react';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';

export interface SurveyFilterState {
  ageGroup: string;
  schoolType: string;
  religion: string;
  casteCommunity: string;
  parentalEducation: string;
  parentalOccupation: string;
  sportsParticipationStatus: string;
  sportsFrequency: string;
  menarcheStatus: string;
  menstrualProductUse: string;
  search: string;
}

interface UseSurveyFiltersResult {
  filteredSurveys: KhelegySurveyResponse[];
  filterState: SurveyFilterState;
  setFilterValue: (field: keyof SurveyFilterState, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

interface UseSurveyFiltersProps {
  surveys: KhelegySurveyResponse[];
}

const createInitialFilterState = (): SurveyFilterState => ({
  ageGroup: '',
  schoolType: '',
  religion: '',
  casteCommunity: '',
  parentalEducation: '',
  parentalOccupation: '',
  sportsParticipationStatus: '',
  sportsFrequency: '',
  menarcheStatus: '',
  menstrualProductUse: '',
  search: '',
});

// Helper function to check if a value matches any of the selected filter values
const matchesFilter = (surveyValue: string | undefined, filterValue: string): boolean => {
  if (!filterValue) return true; // No filter applied
  if (!surveyValue) return false; // Survey has no value for this field
  
  // Split comma-separated values and check if survey value matches any of them
  const selectedValues = filterValue.split(',').filter(v => v.trim() !== '');
  return selectedValues.length === 0 || selectedValues.includes(surveyValue);
};

const applySurveyFilters = (surveys: KhelegySurveyResponse[], filters: SurveyFilterState): KhelegySurveyResponse[] => {
  return surveys.filter(survey => {
    // Text search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        survey.name.toLowerCase().includes(searchTerm) ||
        survey.email?.toLowerCase().includes(searchTerm) ||
        survey.respondentId.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Apply all enum-based filters using multi-select logic
    if (!matchesFilter(survey.ageGroup, filters.ageGroup)) return false;
    if (!matchesFilter(survey.schoolType, filters.schoolType)) return false;
    if (!matchesFilter(survey.religion, filters.religion)) return false;
    if (!matchesFilter(survey.casteCommunity, filters.casteCommunity)) return false;
    if (!matchesFilter(survey.parentalEducation, filters.parentalEducation)) return false;
    if (!matchesFilter(survey.parentalOccupation, filters.parentalOccupation)) return false;
    if (!matchesFilter(survey.sportsParticipationStatus, filters.sportsParticipationStatus)) return false;
    if (!matchesFilter(survey.sportsFrequency, filters.sportsFrequency)) return false;
    if (!matchesFilter(survey.menarcheStatus, filters.menarcheStatus)) return false;
    if (!matchesFilter(survey.menstrualProductUse, filters.menstrualProductUse)) return false;

    return true;
  });
};

const checkActiveFilters = (filters: SurveyFilterState): boolean => {
  return Object.values(filters).some(value => value !== '');
};

export const useSurveyFilters = ({ 
  surveys 
}: UseSurveyFiltersProps): UseSurveyFiltersResult => {
  
  const [filterState, setFilterState] = useState<SurveyFilterState>(createInitialFilterState());

  // Apply filters to surveys
  const filteredSurveys = useMemo(() => {
    return applySurveyFilters(surveys, filterState);
  }, [surveys, filterState]);

  // Set filter value
  const setFilterValue = useCallback((field: keyof SurveyFilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilterState(createInitialFilterState());
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return checkActiveFilters(filterState);
  }, [filterState]);

  return {
    filteredSurveys,
    filterState,
    setFilterValue,
    clearFilters,
    hasActiveFilters,
  };
};
