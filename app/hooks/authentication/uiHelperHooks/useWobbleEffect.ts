'use client'

import { useState, useEffect } from 'react';

export const useWobbleEffect = (
  errorCondition: boolean,
  resetOtp: () => void,
  resetVerifyOTP: () => void,
  firstInputRef: HTMLInputElement | null
) => {
  const [showInvalidBorder, setShowInvalidBorder] = useState(false);
  const [triggerWobble, setTriggerWobble] = useState(false);

  useEffect(() => {
    if (errorCondition) {
      setShowInvalidBorder(true);
      setTriggerWobble(true);

      const timer = setTimeout(() => {
        resetOtp();
        setShowInvalidBorder(false);
        setTriggerWobble(false);
        resetVerifyOTP();
        if (firstInputRef) {
          firstInputRef.focus();
        }
      }, 600); // Duration of wobble and visual feedback

      return () => clearTimeout(timer);
    }
  }, [errorCondition, resetOtp, resetVerifyOTP, firstInputRef]);

  return {
    showInvalidBorder,
    triggerWobble,
  };
}; 