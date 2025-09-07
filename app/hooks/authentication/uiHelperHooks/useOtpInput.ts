'use client'

import { useState, useRef, useEffect } from 'react';

interface UseOtpInputOptions {
  otpLength?: number;
  onComplete?: (otp: string) => void;
}

export const useOtpInput = (options?: UseOtpInputOptions) => {
  const otpLength = options?.otpLength || 6;
  const onComplete = options?.onComplete;

  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Effect to call onComplete when OTP is fully entered
  useEffect(() => {
    const isOtpComplete = otp.every(digit => digit !== '' && /^[0-9]$/.test(digit)) && otp.length === otpLength;
    if (isOtpComplete && onComplete) {
      onComplete(otp.join(''));
    }
  }, [otp, otpLength, onComplete]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otpLength - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const resetOtp = () => {
    setOtp(Array(otpLength).fill(''));
  };

  const isOtpComplete = otp.every(digit => digit !== '' && /^[0-9]$/.test(digit));

  return {
    otp,
    otpRefs,
    handleOtpChange,
    handleKeyDown,
    isOtpComplete,
    resetOtp,
    otpString: otp.join('')
  };
}; 