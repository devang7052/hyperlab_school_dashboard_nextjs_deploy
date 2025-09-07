'use client';

import { useState, useCallback, useEffect } from 'react';
import { StudentWithTestData } from '../../../service/homeService';
import { useHomeTableData } from './useHomeTableData';
import { mergeStudentsWithoutDuplicates, hasMoreData, FIREBASE_FETCH_LIMIT } from '../../../utils/filterHelpers';
import { PaymentStatus } from '../../../models/schoolStudent';

interface UseStudentDataResult {
  students: StudentWithTestData[];
  isLoading: boolean;
  error: Error | null;
  hasMoreData: boolean;
  isFetchingMore: boolean;
  updatePaymentStatus: (studentId: string, paymentStatus: PaymentStatus) => Promise<void>;
  isUpdatingPayment: boolean;
}

interface UseStudentDataProps {
  instituteId: string | null | undefined;
  selectedStd: string;
}

export const useStudentData = ({ 
  instituteId, 
  selectedStd 
}: UseStudentDataProps): UseStudentDataResult => {
  
  // Data caching state
  const [cachedStudents, setCachedStudents] = useState<StudentWithTestData[]>([]);
  const [lastFetchedStudentId, setLastFetchedStudentId] = useState<string | undefined>(undefined);
  const [hasMoreFirebaseData, setHasMoreFirebaseData] = useState<boolean>(true);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Reset state when dependencies change
  const resetState = useCallback(() => {
    setCachedStudents([]);
    setLastFetchedStudentId(undefined);
    setHasMoreFirebaseData(true);
    setIsInitialLoad(true);
  }, []);

  useEffect(() => {
    resetState();
    setShouldFetch(!!selectedStd && !!instituteId);
  }, [instituteId, selectedStd, resetState]);

  // Fetch data from Firebase
  const {
    data: fetchedData,
    isLoading: isFetchingMore,
    error,
    updatePaymentStatus: originalUpdatePaymentStatus,
    isUpdatingPayment,
  } = useHomeTableData({
    instituteId,
    selectedStd,
    lastFetchedStudentId,
    enabled: shouldFetch && hasMoreFirebaseData,
  });

  // Custom update function that updates both local cache and React Query cache
  const updatePaymentStatus = useCallback(async (studentId: string, paymentStatus: PaymentStatus) => {
    // First update local cache for immediate UI response
    setCachedStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, paymentStatus }
          : student
      )
    );
    
    // Then call the original function which handles the Firebase update and React Query cache
    try {
      await originalUpdatePaymentStatus(studentId, paymentStatus);
    } catch (error) {
      // If the update fails, rollback the local cache
      setCachedStudents(prev => 
        prev.map(student => 
          student.id === studentId 
            ? { ...student, paymentStatus: student.paymentStatus === PaymentStatus.PAID ? PaymentStatus.UNPAID : PaymentStatus.PAID }
            : student
        )
      );
      throw error; // Re-throw to let the UI handle the error
    }
  }, [originalUpdatePaymentStatus]
);

  // Process fetched data
  useEffect(() => {
    if (!fetchedData?.students) return;

    const newStudents = fetchedData.students;
    
    if (newStudents.length > 0) {
      // Update cache
      setCachedStudents(prev => mergeStudentsWithoutDuplicates(prev, newStudents));
      
      // Update pagination tracking
      const lastStudent = newStudents[newStudents.length - 1];
      setLastFetchedStudentId(lastStudent.sId);
      
      // Check if more data is available
      const hasMore = hasMoreData(newStudents.length, FIREBASE_FETCH_LIMIT);
      setHasMoreFirebaseData(hasMore);
      setShouldFetch(hasMore);
    } else {
      setHasMoreFirebaseData(false);
      setShouldFetch(false);
    }
    
    setIsInitialLoad(false);
  }, [fetchedData]);

  const isLoading = (isFetchingMore && isInitialLoad) || (isFetchingMore && cachedStudents.length === 0);

  return {
    students: cachedStudents,
    isLoading,
    error,
    hasMoreData: hasMoreFirebaseData,
    isFetchingMore: isFetchingMore && hasMoreFirebaseData,
    updatePaymentStatus,
    isUpdatingPayment,
  };
}; 