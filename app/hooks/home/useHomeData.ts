'use client';

import { useQuery } from '@tanstack/react-query';
import { homeService, HomeData } from '../../service/homeService';

interface UseHomeDataResult {
  data: HomeData | null;
  isLoading: boolean;
  error: Error | null;
}

export const useHomeData = (email: string | null | undefined): UseHomeDataResult => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['homeData', email],
    queryFn: async (): Promise<HomeData | null> => {
      if (!email) {
        throw new Error('Email is required to fetch home data');
      }
      
      try {
        const result = await homeService.getHomeData(email);
        if (!result) {
          throw new Error('No data found for the provided email');
        }
        return result;
      } catch (error) {
        console.error('Error fetching home data:', error);
        throw error;
      }
    },
    enabled: !!email, // Only run query if email exists
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (renamed from cacheTime)
    retry: (failureCount, error) => {
      // Don't retry for authentication errors or missing data
      if (error instanceof Error && (
          error.message.includes('Email is required') || 
          error.message.includes('No data found'))) {
        return false;
      }
      // Retry network errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });

  return {
    data: data ?? null,
    isLoading,
    error: error as Error | null,
  };
}; 