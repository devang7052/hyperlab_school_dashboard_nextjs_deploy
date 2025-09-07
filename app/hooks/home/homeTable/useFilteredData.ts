'use client';

import { useState, useCallback } from 'react';
import { StudentWithTestData } from '../../../service/homeService';
import { FilterType, FilterState } from '../../../utils/filterHelpers';
import { useStudentData } from './useStudentData';
import { useStudentFilters } from './useStudentFilters';
import { useUIPagination } from './useUIPagination';
import { useTableSorting } from './useTableSorting';
import { SortField } from '../../../utils/sortHelpers';
import { PaymentStatus } from '../../../models/schoolStudent';

interface UseFilteredDataResult {
  students: StudentWithTestData[];
  isLoading: boolean;
  error: Error | null;
  selectedStd: string;
  setSelectedStd: (std: string) => void;
  filterState: FilterState;
  setFilterValue: (type: FilterType | string, value: string) => void;
  toggleMultiFilterValue: (type: FilterType, value: string) => void;
  clearFilters: () => void;
  loadMoreUIStudents: () => void;
  hasMoreUIStudents: boolean;
  isFetchingMore: boolean;
  hasActiveFilters: boolean;
  // Sorting functionality
  handleSort: (field: SortField) => void;
  getSortIconForField: (field: SortField) => string;
  isSorting: boolean;
  // Payment status update functionality
  updatePaymentStatus: (studentId: string, paymentStatus: PaymentStatus) => Promise<void>;
  isUpdatingPayment: boolean;
}

interface UseFilteredDataProps {
  instituteId: string | null | undefined;
}

/**
 * Orchestrator hook that combines data fetching, filtering, and UI pagination
 * This is a composition of focused hooks for better maintainability
 */
export const useFilteredData = ({ 
  instituteId 
}: UseFilteredDataProps): UseFilteredDataResult => {
  
  const [selectedStd, setSelectedStd] = useState<string>('');

  // Data fetching and caching
  const {
    students: allStudents,
    isLoading: dataLoading,
    error,
    isFetchingMore,
    updatePaymentStatus,
    isUpdatingPayment,
  } = useStudentData({ instituteId, selectedStd });

  // Filtering logic
  const {
    filteredStudents: allFilteredStudents,
    filterState,
    setFilterValue: setFilter,
    toggleMultiFilterValue: toggleMultiFilter,
    clearFilters: clearAllFilters,
    hasActiveFilters,
  } = useStudentFilters({ students: allStudents });

  // Sorting logic (applied to all filtered students)
  const {
    sortedStudents: allSortedStudents,
    handleSort,
    getSortIconForField,
    isSorting,
  } = useTableSorting({ students: allFilteredStudents });

  // UI pagination (applied to sorted, filtered students)
  const {
    displayedItems: displayedStudents,
    loadMore,
    hasMore: hasMoreUIStudents,
    reset: resetPagination,
  } = useUIPagination({ items: allSortedStudents });

  // Enhanced filter setter that also resets pagination
  const setFilterValue = useCallback((type: FilterType | string, value: string) => {
    setFilter(type, value);
  }, [setFilter]);

  // Enhanced multi-filter toggle that also resets pagination
  const toggleMultiFilterValue = useCallback((type: FilterType, value: string) => {
    toggleMultiFilter(type, value);
  }, [toggleMultiFilter]);

  // Enhanced clear filters that also resets pagination
  const clearFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  // Enhanced std setter that also resets pagination
  const handleSetSelectedStd = useCallback((std: string) => {
    setSelectedStd(std);
    resetPagination();
  }, [resetPagination]);

  return {
    students: displayedStudents,
    isLoading: dataLoading,
    error,
    selectedStd,
    setSelectedStd: handleSetSelectedStd,
    filterState,
    setFilterValue,
    toggleMultiFilterValue,
    clearFilters,
    loadMoreUIStudents: loadMore,
    hasMoreUIStudents,
    isFetchingMore,
    hasActiveFilters,
    // Sorting functionality
    handleSort,
    getSortIconForField,
    isSorting,
    // Payment status update functionality
    updatePaymentStatus,
    isUpdatingPayment,
  };
}; 