// addSchool/page.tsx - Add School page component
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAddSchool } from '../../hooks/useAddSchool'
import EmailInputForm from '../../components/common/EmailInputForm'
import OtpInputForm from '../../components/common/OtpInputForm'
import { validateEmail } from '@/app/utils/formatters'

export default function AddSchoolPage() {
  const router = useRouter()
  const { 
    currentEmail,
    sendOTP,
    isSendingOTP,
    sendOTPError: hookSendOTPError,
    resetSendOTP,
    verifyOTPAndAddSchool,
    isVerifyingOTP,
    verifyOTPError,
    setCurrentEmail,
    resetVerifyOTP,
    isSuccess
  } = useAddSchool()
  
  // Redirect to home when school is successfully added
  useEffect(() => {
    if (isSuccess) {
      router.push('/home')
    }
  }, [isSuccess, router])

  const handleAddSchoolSubmit = (e: React.FormEvent, email: string) => {
    e.preventDefault()
    resetSendOTP()
    sendOTP(email)
  }

  const handleOTPSubmit = (e: React.FormEvent, email: string, otp: string) => {
    e.preventDefault()
    resetVerifyOTP()
    verifyOTPAndAddSchool({ email, otp })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
     <header className="w-full bg-[var(--foreground)] py-6 px-13 flex justify-between items-center ">
        <img src="/icons/hyperlab_logo.svg" alt="Hyperlab Logo" className="h-8" />
        <div className="">
          <span className="text-md mr-3 font-['Manrope'] text-[var(--neutral-10)]">Unable to login?</span>
          <button className="bg-[var(--neutral-20)] text-[var(--neutral-700)] font-['Manrope'] px-4 py-2  text-md cursor-pointer hover:bg-gray-100 transition-colors">
            Contact Us
          </button>
        </div>
      </header>
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Show OTP form if email is set, otherwise show email input form */}
          {currentEmail ? (
            <OtpInputForm
              title="Enter OTP to add Organization"
              emailDisplay={currentEmail}
              submitButtonText="ADD ORGANIZATION"
              isSubmitting={isVerifyingOTP}
              submitError={verifyOTPError}
              sendOtp={sendOTP}
              isSendingOtp={isSendingOTP}
              onBack={() => setCurrentEmail('')}
              handleOtpSubmit={handleOTPSubmit}
              resetSubmitError={resetVerifyOTP}
            />
          ) : (
            <>
              <EmailInputForm
                title="Enter email of the organization you want to add"
                errorMessage={hookSendOTPError}
                handleSubmit={handleAddSchoolSubmit}
                isSubmitting={isSendingOTP}
                validateEmail={validateEmail}
                titleAlignment="left"
                onClearError={() => resetSendOTP()}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => router.back()}
                  className="text-[var(--primary-500)] font-['MADE_Outer_Sans_Regular'] px-4 py-2 text-lg cursor-pointer hover:text-[var(--primary-400)] transition-colors "
                >
                  BACK
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 





