// utils/otpManager.ts - Utility for managing OTP storage and verification
import type { StoredOTP } from '../models/helpers/authTypes'
import { QueryClient } from '@tanstack/react-query'

// Cache key for OTP storage
const OTP_CACHE_KEY = 'otp-storage';

// Type for OTP storage cache
type OTPStorageType = Record<string, StoredOTP>;

/**
 * Stores an OTP in the React Query cache with 5-minute expiration
 */
export const storeOTP = (
  queryClient: QueryClient,
  email: string, 
  otp: string
): void => {
  const otpStorage = queryClient.getQueryData<OTPStorageType>([OTP_CACHE_KEY]) || {};
  
  // Store OTP with expiration (5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  
  queryClient.setQueryData([OTP_CACHE_KEY], {
    ...otpStorage,
    [email]: { otp, expiresAt }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 DEV MODE - OTP:', otp);
  }
};

/**
 * Retrieves a stored OTP from the React Query cache
 */
export const getStoredOTP = (
  queryClient: QueryClient,
  email: string
): StoredOTP | undefined => {
  const otpStorage = queryClient.getQueryData<OTPStorageType>([OTP_CACHE_KEY]) || {};
  return otpStorage[email];
};

/**
 * Clears an OTP from the React Query cache
 */
export const clearOTP = (
  queryClient: QueryClient,
  email: string
): void => {
  const otpStorage = queryClient.getQueryData<OTPStorageType>([OTP_CACHE_KEY]) || {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [email]: _, ...rest } = otpStorage;
  queryClient.setQueryData([OTP_CACHE_KEY], rest);
}; 