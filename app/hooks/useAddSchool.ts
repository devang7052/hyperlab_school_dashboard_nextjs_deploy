// hooks/authentication/useAddSchool.ts - Custom hook for adding school connections
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useState, useCallback } from 'react'
import type { OTPResponse } from '../models/helpers/authTypes'
import type { SchoolInstitute } from '../models/schoolInstitute'
import AuthService from '../service/authService'
import { SchoolConnectionRepository } from '../repository/schoolConnectionRepository'
import { storeOTP, getStoredOTP, clearOTP } from '../utils/otpManager'

export const useAddSchool = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const [currentEmail, setCurrentEmail] = useState<string>('')
  const schoolConnectionRepository = new SchoolConnectionRepository()

  // Send OTP Mutation - reused from useAuth
  const sendOTPMutation = useMutation({
    mutationFn: async (email: string): Promise<OTPResponse> => {
      // Check if user is trying to add their own organization
      if (session?.user?.email === email) {
        throw new Error('You cannot add your own organization');
      }
      
      // First verify the email exists in our system and get the institute data
      const schoolInstitute = await AuthService.checkEmailExistence(email);
      
      if (!schoolInstitute) {
        throw new Error('This email is not registered with any organization');
      }
      
      // Check if the school is already connected to the current user
      if (session?.user?.instituteId) {
        const isAlreadyConnected = await schoolConnectionRepository.isSchoolAlreadyConnected(
          session.user.instituteId,
          schoolInstitute.id as string
        );

        
        
        if (isAlreadyConnected) {
          throw new Error('This organization is already added to your account');
        }
      }
      
      // Store the school institute data in React Query cache
      queryClient.setQueryData(['schoolInstitute', email], schoolInstitute);
      
      const result = await AuthService.sendOTP(email);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send OTP');
      }
      
      // Store the OTP in the cache using otpManager
      if (result.otp) {
        storeOTP(queryClient, email, result.otp);
      }
      
      return result;
    },
    onSuccess: (data, email) => {
      if (data.success) {
        setCurrentEmail(email);
      }
    }
  });

  // Verify OTP and Add School Connection
  const verifyOTPAndAddSchoolMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const storedOTP = getStoredOTP(queryClient, email);
      
      if (!storedOTP) {
        throw new Error('OTP not found or expired');
      }
      
      const verification = AuthService.verifyOTP(otp, storedOTP);
      
      if (!verification.success) {
        throw new Error(verification.message);
      }
      
      clearOTP(queryClient, email);
      
      // Get the school institute data from cache
      const schoolInstitute = queryClient.getQueryData<SchoolInstitute>(['schoolInstitute', email]);
      
      if (!schoolInstitute?.id) {
        throw new Error('School institute data not found');
      }
      
      // Get current user's institute ID from session
      if (!session?.user?.instituteId) {
        throw new Error('User not authenticated or institute ID not found');
      }
      
      // Add or update school connection using instituteId as parentId
      await schoolConnectionRepository.addOrUpdateSchoolConnection(
        session.user.instituteId, // Use current user's institute ID as parentId
        schoolInstitute.id
      );
      
      return { success: true, schoolInstitute };
    },
    onSuccess: () => {
      setCurrentEmail('');
      // Invalidate home data to refresh connected schools list
      queryClient.invalidateQueries({ queryKey: ['homeData'] });
    }
  });
  
  // Return all necessary state and functions
  return {
    // OTP operations
    sendOTP: sendOTPMutation.mutate,
    verifyOTPAndAddSchool: verifyOTPAndAddSchoolMutation.mutate,

    // Email state
    currentEmail,
    setCurrentEmail,

    // Loading states
    isSendingOTP: sendOTPMutation.isPending,
    isVerifyingOTP: verifyOTPAndAddSchoolMutation.isPending,
    
    // Error states
    sendOTPError: sendOTPMutation.error?.message || null,
    verifyOTPError: verifyOTPAndAddSchoolMutation.error?.message || null,
    
    // Success state
    isSuccess: verifyOTPAndAddSchoolMutation.isSuccess,
    
    // Reset functions
    resetSendOTP: useCallback(() => sendOTPMutation.reset(), [sendOTPMutation]),
    resetVerifyOTP: useCallback(() => verifyOTPAndAddSchoolMutation.reset(), [verifyOTPAndAddSchoolMutation]),
  };
}; 