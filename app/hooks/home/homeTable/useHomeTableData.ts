'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homeService, HomeTableData } from '../../../service/homeService';
import { FIREBASE_FETCH_LIMIT } from '@/app/utils/filterHelpers';
import { PaymentStatus } from '@/app/models/schoolStudent';

interface UseHomeTableDataResult {
  data: HomeTableData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  updatePaymentStatus: (studentId: string, paymentStatus: PaymentStatus) => Promise<void>;
  isUpdatingPayment: boolean;
}

interface UseHomeTableDataProps {
  instituteId: string | null | undefined;
  selectedStd: string;
  lastFetchedStudentId?: string;
  enabled?: boolean;
}

export const useHomeTableData = ({ 
  instituteId, 
  selectedStd, 
  lastFetchedStudentId, 
  enabled = true 
}: UseHomeTableDataProps): UseHomeTableDataResult => {

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<HomeTableData | null, Error>({
    queryKey: ['homeTableData', instituteId, selectedStd, lastFetchedStudentId],
    queryFn: async (): Promise<HomeTableData | null> => {
      if (!instituteId || !selectedStd) {
        return { students: [], totalCount: 0 };
      }
      
      try {
        const result = await homeService.getHomeTableData(
          instituteId,
          selectedStd,
          FIREBASE_FETCH_LIMIT,
          lastFetchedStudentId
        );

        return result || { students: [], totalCount: 0 };
      } catch (err) {
        console.error('Error fetching home table data:', err);
        throw err;
      }
    },
    enabled: enabled && !!instituteId && !!selectedStd,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, err) => {
      if (err instanceof Error && err.message.includes('No table data found')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const paymentStatusMutation = useMutation({
    mutationFn: async ({ studentId, paymentStatus }: { studentId: string; paymentStatus: PaymentStatus }) => {
      await homeService.updateStudentPaymentStatus(studentId, paymentStatus);
    },
    // OPTIMISTIC UPDATE: Immediately update UI before API call
    onMutate: async ({ studentId, paymentStatus }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['homeTableData', instituteId, selectedStd] });

      // Snapshot the previous value for rollback if needed
      const previousData = queryClient.getQueryData<HomeTableData | null>(['homeTableData', instituteId, selectedStd]);

      // Optimistically update the cache with new payment status
      queryClient.setQueryData<HomeTableData | null>(['homeTableData', instituteId, selectedStd], (oldData) => {
        if (!oldData?.students) return oldData;

        return {
          ...oldData,
          students: oldData.students.map((student) =>
            student.id === studentId
              ? { ...student, paymentStatus }
              : student
          ),
        };
      });

      // Return context object with the rollback data
      return { previousData };
    },

    onError: (error, variables, context) => {
      // ROLLBACK: If the mutation fails, restore the previous state
      if (context?.previousData) {
        queryClient.setQueryData(['homeTableData', instituteId, selectedStd], context.previousData);
      }
      console.error('Error updating payment status:', error);
    },

  });

  const updatePaymentStatus = async (studentId: string, paymentStatus: PaymentStatus) => {
    await paymentStatusMutation.mutateAsync({ studentId, paymentStatus });
  };

  return {
    data: data ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
    updatePaymentStatus,
    isUpdatingPayment: paymentStatusMutation.isPending,
  };
};