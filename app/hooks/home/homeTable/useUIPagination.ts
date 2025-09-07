'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { UI_INITIAL_DISPLAY, UI_DISPLAY_INCREMENT } from '../../../utils/filterHelpers';

interface UseUIPaginationResult<T> {
  displayedItems: T[];
  loadMore: () => void;
  hasMore: boolean;
  displayedCount: number;
  totalCount: number;
  reset: () => void;
}

interface UseUIPaginationProps<T> {
  items: T[];
  increment?: number;
}

/**
 * Generic hook for UI pagination
 * Handles displaying a subset of items with load-more functionality
 */
export const useUIPagination = <T>({ 
  items, 
  increment = UI_DISPLAY_INCREMENT,
}: UseUIPaginationProps<T>): UseUIPaginationResult<T> => {
  
  const [displayedCount, setDisplayedCount] = useState<number>(UI_INITIAL_DISPLAY);
  const previousItemsLength = useRef<number>(0);

  // Smart reset logic - only reset when items array significantly changes (like after filtering)
  // Don't reset when items are just being added (like when fetching more data)
  useEffect(() => {
    const currentLength = items.length;
    const previousLength = previousItemsLength.current;
    
    if (currentLength > previousLength && displayedCount > currentLength) {
      setDisplayedCount(Math.max(UI_INITIAL_DISPLAY, currentLength));
    }
    
    previousItemsLength.current = currentLength;
  }, [items.length, displayedCount]);

  // Get items to display
  const displayedItems = useMemo(() => {
    return items.slice(0, displayedCount);
  }, [items, displayedCount]);

  // Load more items
  const loadMore = useCallback(() => {
    setDisplayedCount(prev => prev + increment);
  }, [increment]);

  // Reset to initial state
  const reset = useCallback(() => {
    setDisplayedCount(UI_INITIAL_DISPLAY);
  }, []);

  // Check if there are more items to load
  const hasMore = displayedItems.length < items.length;

  return {
    displayedItems,
    loadMore,
    hasMore,
    displayedCount,
    totalCount: items.length,
    reset,
  };
}; 