// app/components/common/OtpInputForm.tsx - Generalized OTP input form component
'use client'

import { useEffect, useRef } from 'react'
import LoadingSpinner from '@/app/components/common/loadingSpinner';
import { useOtpInput } from '@/app/hooks/authentication/uiHelperHooks/useOtpInput';
import { useResendTimer } from '@/app/hooks/authentication/uiHelperHooks/useResendTimer';
import { useWobbleEffect } from '@/app/hooks/authentication/uiHelperHooks/useWobbleEffect';

interface OtpInputFormProps {
  title: string;
  emailDisplay: string;
  submitButtonText: string;
  isSubmitting: boolean;
  submitError: string | null;
  sendOtp: (email: string) => void;
  isSendingOtp: boolean;
  onBack: () => void;
  handleOtpSubmit: (e: React.FormEvent, email: string, otp: string) => void;
  resetSubmitError: () => void;
}

export default function OtpInputForm({
  title,
  emailDisplay,
  submitButtonText,
  isSubmitting,
  submitError,
  sendOtp,
  isSendingOtp,
  onBack,
  handleOtpSubmit,
  resetSubmitError
}: OtpInputFormProps) {
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  const { otp, otpRefs, handleOtpChange, handleKeyDown, isOtpComplete, resetOtp, otpString } = useOtpInput({
    otpLength: 6
  });
  const { resetTimer, formattedTime, isTimerActive } = useResendTimer({
    initialTimeLimit: 60
  });
  const { showInvalidBorder, triggerWobble } = useWobbleEffect(
    submitError === 'Invalid OTP',
    resetOtp,
    resetSubmitError,
    otpRefs.current[0]
  );

  useEffect(() => {
    if (isOtpComplete && !isSubmitting) {
      const timer = setTimeout(() => {
        if (submitButtonRef.current) {
          submitButtonRef.current.click();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOtpComplete, isSubmitting]);

  const handleResendOTP = () => {
    resetTimer()
    sendOtp(emailDisplay)
  }

  return (
    <div className="mt-8 space-y-9">
      <h2 className="text-center text-4xl  text-[var(--neutral-500)] font-['MADE_Outer_Sans_Light']">
        {title}
      </h2>

      <div className="text-center">
        <p className="text-md text-[var(--neutral-200)] mt-12 font-['MADE_Outer_Sans_Light']">
        A 6-digit OTP has been sent to your email
        </p>
        <p className="text-md font-medium text-[var(--primary-500)]  font-['MADE_Outer_Sans_Light']">
          {emailDisplay}
        </p>
      </div>

      <form onSubmit={(e) => handleOtpSubmit(e, emailDisplay, otpString)}>
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { if (el) otpRefs.current[index] = el; }}
              id={`otp-${index}`}
              name={`otp-${index}`}
              type="text"
              maxLength={1}
              autoComplete="one-time-code"
              required
              className={`w-12 h-12 text-center text-xl font-['MADE_Outer_Sans_Light'] border ${showInvalidBorder ? 'border-2 border-[var(--primary-600)] ' : 'border-[var(--neutral-40)]'} focus:outline-none focus:ring-1 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] disabled:bg-[var(--neutral-10)] disabled:cursor-not-allowed ${triggerWobble ? 'wobble' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isSubmitting}
            />
          ))}
        </div>

        <div className="flex justify-between px-15 items-center mt-2 text-md">
          <p className="font-['MADE_Outer_Sans_Light'] text-[var(--neutral-200)]">
          Didn&apos;t receive OTP?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isTimerActive || isSendingOtp}
            className={`font-['MADE_Outer_Sans_Light'] ${isTimerActive ? 'text-[var(--neutral-800)] cursor-not-allowed' : 'cursor-pointer'} }`}
          >
            {isSendingOtp ? "" : (isTimerActive ? `Resend in ${formattedTime}` : 'Resend')}
          </button>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            disabled={isSubmitting || !isOtpComplete}
            className={`group relative w-84 mx-auto py-3 px-8 ml-14  text-md font-['MADE_Outer_Sans_Light']   ${isOtpComplete ? 'bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-[var(--neutral-10)] cursor-pointer' : 'bg-[var(--neutral-80)] text-white'}  disabled:opacity-50 disabled:cursor-not-allowed `}
            ref={submitButtonRef}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size={20} color='border-white' />
                <span className="ml-2"></span>
              </div>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-lg font-['MADE_Outer_Sans_Light'] text-[var(--primary-500)] hover:text-[var(--primary-600)] cursor-pointer"
        >
          BACK
        </button>
      </div>
    </div>
  )
} 