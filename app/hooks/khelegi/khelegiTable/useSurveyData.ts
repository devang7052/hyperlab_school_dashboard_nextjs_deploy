'use client';

import { useQuery } from '@tanstack/react-query';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import { khelegiService } from '../../../service/khelegiService';
// import { getMockKhelegiSurveyData } from '../../../service/mockKhelegiData'; // Fallback mock data

interface UseSurveyDataResult {
  surveys: KhelegySurveyResponse[];
  isLoading: boolean;
  error: Error | null;
  hasMoreData: boolean;
  isFetchingMore: boolean;
}

interface UseSurveyDataProps {
  enabled?: boolean;
  formId?: string; // Optional form ID to filter responses
  limit?: number; // Optional limit for number of responses
}

export const useSurveyData = ({ 
  enabled = true,
  formId,
  limit
}: UseSurveyDataProps): UseSurveyDataResult => {
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['khelegiSurveyData', formId, limit],
    queryFn: async () => {
      try {
        // Use real Firestore data through khelegiService
        const result = await khelegiService.getKhelegiSurveyData(formId, limit);
        console.log('Fetched survey data:', result.surveys.length, 'surveys');
        return result;
      } catch (error) {
        console.error('Error in useSurveyData queryFn:', error);
        throw error;
      }
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: (failureCount, error) => {
      // Don't retry for authentication errors or missing data
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        return false;
      }
      // Retry network errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    surveys: data?.surveys || [],
    isLoading,
    error: error as Error | null,
    hasMoreData: false, // For now, we load all data at once
    isFetchingMore: false,
  };
};
