'use client'

import { useState, useEffect, useCallback } from 'react';
import { formatTime } from '../../../utils/formatters';

interface UseResendTimerOptions {
  initialTimeLimit?: number;
}

export const useResendTimer = (options?: UseResendTimerOptions) => {
  const RESEND_TIME_LIMIT = options?.initialTimeLimit || 60;
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME_LIMIT);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const resetTimer = useCallback(() => {
    setTimeLeft(RESEND_TIME_LIMIT);
  }, [RESEND_TIME_LIMIT]);

  return {
  
    resetTimer,
    formattedTime: formatTime(timeLeft),
    isTimerActive: timeLeft > 0
  };
}; 