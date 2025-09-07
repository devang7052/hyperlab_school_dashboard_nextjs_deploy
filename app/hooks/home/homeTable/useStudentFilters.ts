'use client';

import { useState, useCallback, useMemo } from 'react';
import { StudentWithTestData } from '../../../service/homeService';
import { 
  FilterType, 
  FilterState, 
  createInitialFilterState,
  applyFilters,
  normalizeFilterType,
  toggleFilterValue,
  hasActiveFilters as checkActiveFilters
} from '../../../utils/filterHelpers';

interface UseStudentFiltersResult {
  filteredStudents: StudentWithTestData[];
  filterState: FilterState;
  setFilterValue: (type: FilterType | string, value: string) => void;
  toggleMultiFilterValue: (type: FilterType, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

interface UseStudentFiltersProps {
  students: StudentWithTestData[];
}

/**
 * Hook for managing student filtering logic
 * Handles filter state and applies filters to student data
 * Supports both single-value and multi-value (checkbox) filters
 */
export const useStudentFilters = ({ 
  students, 
}: UseStudentFiltersProps): UseStudentFiltersResult => {
  
  const [filterState, setFilterState] = useState<FilterState>(createInitialFilterState());

  // Apply filters to students
  const filteredStudents = useMemo(() => {
    return applyFilters(students, filterState);
  }, [students, filterState]);

  // Set filter value with normalization (for single-value filters)
  const setFilterValue = useCallback((typeOrKey: FilterType | string, value: string) => {
    const filterType = normalizeFilterType(typeOrKey);
    
    setFilterState(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Toggle filter value for multi-select filters (checkboxes)
  const toggleMultiFilterValue = useCallback((type: FilterType, value: string) => {
    setFilterState(prev => {
      const currentValues = prev[type] as string[];
      return {
        ...prev,
        [type]: toggleFilterValue(currentValues, value)
      };
    });
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
    filteredStudents,
    filterState,
    setFilterValue,
    toggleMultiFilterValue,
    clearFilters,
    hasActiveFilters,
  };
}; 