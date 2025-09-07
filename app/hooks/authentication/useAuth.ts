// hooks/useAuth.ts - Custom authentication hook with React Query
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession, signIn } from 'next-auth/react'
import { useState, useCallback } from 'react'
import type { OTPResponse } from '../../models/helpers/authTypes'
import AuthService from '../../service/authService'
import { storeOTP, getStoredOTP, clearOTP } from '../../utils/otpManager'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()
  const [currentEmail, setCurrentEmail] = useState<string>('')

  // Send OTP Mutation
  const sendOTPMutation = useMutation({
    mutationFn: async (email: string): Promise<OTPResponse> => {
      // First verify the email exists in our system and get the institute data
      const schoolInstitute = await AuthService.checkEmailExistence(email);
      
      if (!schoolInstitute) {
        throw new Error('This email is not registered with any organization');
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
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    }
  });

  // Verify OTP Mutation using NextAuth
  const verifyOTPMutation = useMutation({
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
      
      const result = await signIn('email-otp', {
        email,
        otp,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      return result;
    },
    onSuccess: () => {
      setCurrentEmail('');
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    }
  });
  
  
  // Return all necessary state and functions
  return {
    // Auth state
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    
    // OTP operations
    sendOTP: sendOTPMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,

    // Email state
    currentEmail,
    setCurrentEmail,

    // Loading states
    isSendingOTP: sendOTPMutation.isPending,
    isVerifyingOTP: verifyOTPMutation.isPending,
    
    // Error states
    sendOTPError: sendOTPMutation.error?.message || null,
    verifyOTPError: verifyOTPMutation.error?.message || null,
    
    // Reset functions
    resetSendOTP: useCallback(() => sendOTPMutation.reset(), [sendOTPMutation]),
    resetVerifyOTP: useCallback(() => verifyOTPMutation.reset(), [verifyOTPMutation]),
  };
} 