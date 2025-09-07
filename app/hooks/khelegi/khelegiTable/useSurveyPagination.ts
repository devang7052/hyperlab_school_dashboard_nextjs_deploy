'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';

interface UseSurveyPaginationResult {
  displayedSurveys: KhelegySurveyResponse[];
  loadMore: () => void;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  reset: () => void;
}

interface UseSurveyPaginationProps {
  surveys: KhelegySurveyResponse[];
  itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 20;

export const useSurveyPagination = ({ 
  surveys, 
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE 
}: UseSurveyPaginationProps): UseSurveyPaginationResult => {
  
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset pagination when surveys change
  useEffect(() => {
    setCurrentPage(1);
  }, [surveys]);

  // Calculate pagination values
  const totalItems = surveys.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = 0;
  const endIndex = currentPage * itemsPerPage;

  // Get displayed surveys (load more pattern)
  const displayedSurveys = useMemo(() => {
    return surveys.slice(startIndex, endIndex);
  }, [surveys, startIndex, endIndex]);

  // Check if more items are available
  const hasMore = useMemo(() => {
    return endIndex < totalItems;
  }, [endIndex, totalItems]);

  // Load more function
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  // Reset pagination
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    displayedSurveys,
    loadMore,
    hasMore,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    reset,
  };
};
