'use client';

import { useState, useCallback, useMemo } from 'react';
import { StudentWithTestData } from '../../../service/homeService';
import { 
  SortState, 
  SortField, 
  SortDirection,
  createInitialSortState,
  sortStudents,
  getNextSortDirection,
  getSortIcon
} from '../../../utils/sortHelpers';

interface UseTableSortingProps {
  students: StudentWithTestData[];
}

interface UseTableSortingResult {
  sortedStudents: StudentWithTestData[];
  sortState: SortState;
  handleSort: (field: SortField) => void;
  getSortIconForField: (field: SortField) => string;
  isSorting: boolean;
}

/**
 * Hook for managing table sorting functionality
 * Handles sort state and applies sorting to student data
 * Works on all cached data, not just visible data
 */
export const useTableSorting = ({ 
  students 
}: UseTableSortingProps): UseTableSortingResult => {
  
  const [sortState, setSortState] = useState<SortState>(createInitialSortState());

  // Apply sorting to all students
  const sortedStudents = useMemo(() => {
    return sortStudents(students, sortState.field, sortState.direction);
  }, [students, sortState.field, sortState.direction]);

  // Handle sort column click
  const handleSort = useCallback((field: SortField) => {
    setSortState(prev => {
      const isCurrentField = prev.field === field;
      const currentDirection = isCurrentField ? prev.direction : SortDirection.NONE;
      const newDirection = getNextSortDirection(currentDirection);
      
      return {
        field: newDirection === SortDirection.NONE ? null : field,
        direction: newDirection
      };
    });
  }, []);

  // Get sort icon for specific field
  const getSortIconForField = useCallback((field: SortField): string => {
    return getSortIcon(field, sortState.field, sortState.direction);
  }, [sortState.field, sortState.direction]);

  // Check if currently sorting
  const isSorting = useMemo(() => {
    return sortState.field !== null && sortState.direction !== SortDirection.NONE;
  }, [sortState]);

  return {
    sortedStudents,
    sortState,
    handleSort,
    getSortIconForField,
    isSorting,
  };
}; 