'use client';

import { useCallback } from 'react';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import { useSurveyData } from './useSurveyData';
import { useSurveyFilters, SurveyFilterState } from './useSurveyFilters';
import { useSurveyPagination } from './useSurveyPagination';
import { useSurveySorting, SurveySortField } from './useSurveySorting';

interface UseFilteredSurveyDataResult {
  surveys: KhelegySurveyResponse[];
  isLoading: boolean;
  error: Error | null;
  filterState: SurveyFilterState;
  setFilterValue: (field: keyof SurveyFilterState, value: string) => void;
  clearFilters: () => void;
  loadMoreSurveys: () => void;
  hasMoreSurveys: boolean;
  hasActiveFilters: boolean;
  // Sorting functionality
  handleSort: (field: SurveySortField) => void;
  getSortIconForField: (field: SurveySortField) => string;
  isSorting: boolean;
  // Pagination info
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UseFilteredSurveyDataProps {}

/**
 * Orchestrator hook that combines data fetching, filtering, sorting, and UI pagination for surveys
 * This is a composition of focused hooks for better maintainability
 */
export const useFilteredSurveyData = ({ 
}: UseFilteredSurveyDataProps): UseFilteredSurveyDataResult => {

  // Data fetching - fetch all survey responses without form ID filtering
  const {
    surveys: allSurveys,
    isLoading: dataLoading,
    error,
  } = useSurveyData({ 
    // Removed formId to fetch all survey responses
  });

  // Filtering logic
  const {
    filteredSurveys: allFilteredSurveys,
    filterState,
    setFilterValue: setFilter,
    clearFilters: clearAllFilters,
    hasActiveFilters,
  } = useSurveyFilters({ surveys: allSurveys });

  // Sorting logic (applied to all filtered surveys)
  const {
    sortedSurveys: allSortedSurveys,
    handleSort,
    getSortIconForField,
    isSorting,
  } = useSurveySorting({ surveys: allFilteredSurveys });

  // UI pagination (applied to sorted, filtered surveys)
  const {
    displayedSurveys: displayedSurveys,
    loadMore,
    hasMore: hasMoreSurveys,
    currentPage,
    totalPages,
    totalItems,
    reset: resetPagination,
  } = useSurveyPagination({ surveys: allSortedSurveys });

  // Enhanced filter setter that also resets pagination
  const setFilterValue = useCallback((field: keyof SurveyFilterState, value: string) => {
    setFilter(field, value);
    resetPagination();
  }, [setFilter, resetPagination]);

  // Enhanced clear filters that also resets pagination
  const clearFilters = useCallback(() => {
    clearAllFilters();
    resetPagination();
  }, [clearAllFilters, resetPagination]);

  return {
    surveys: displayedSurveys,
    isLoading: dataLoading,
    error,
    filterState,
    setFilterValue,
    clearFilters,
    loadMoreSurveys: loadMore,
    hasMoreSurveys,
    hasActiveFilters,
    // Sorting functionality
    handleSort,
    getSortIconForField,
    isSorting,
    // Pagination info
    currentPage,
    totalPages,
    totalItems,
  };
};
