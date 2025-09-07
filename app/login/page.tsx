// login/page.tsx - Login page component
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/authentication/useAuth'
import LoadingSpinner from '../components/common/loadingSpinner'
import EmailInputForm from '../components/common/EmailInputForm'
import OtpInputForm from '../components/common/OtpInputForm'
import { validateEmail } from '@/app/utils/formatters'

export default function LoginPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { 
    isAuthenticated, 
    isLoading, 
    currentEmail,
    sendOTP,
    isSendingOTP,
    sendOTPError,
    resetSendOTP,
    verifyOTP,
    isVerifyingOTP,
    verifyOTPError,
    setCurrentEmail,
    resetVerifyOTP
  } = useAuth()


  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Check if the user has the specific instituteId for Khelegi
      const userInstituteId = session?.user?.instituteId;
      if (userInstituteId === 'TZdRbPUYDBWgugLS33R7') {
        router.push('/khelegi');
      } else {
        router.push('/home');
      }
    }
  }, [isAuthenticated, isLoading, router, session?.user?.instituteId])

  const handleLoginSubmit = (e: React.FormEvent, email: string) => {
    e.preventDefault()
    resetSendOTP()
    sendOTP(email)
  }

  const handleOTPSubmit = (e: React.FormEvent, email: string, otp: string) => {
    e.preventDefault()
    resetVerifyOTP()

    verifyOTP({ email, otp })
  }


  // Show loading state
  if (isLoading || isAuthenticated) {
    return <LoadingSpinner size={100}  />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full bg-black py-6 pl-13 text-left ">
        <Image src="/icons/hyperlab_logo.svg" alt="Hyperlab Logo" width={32} height={32} className="h-8" />
      </header>
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Show OTP form if email is set, otherwise show login form */}
          {currentEmail ? (
            <OtpInputForm
              title="Enter OTP"
              emailDisplay={currentEmail}
              submitButtonText="LOGIN"
              isSubmitting={isVerifyingOTP}
              submitError={verifyOTPError}
              sendOtp={sendOTP}
              isSendingOtp={isSendingOTP}
              onBack={() => setCurrentEmail('')}
              handleOtpSubmit={handleOTPSubmit}
              resetSubmitError={resetVerifyOTP}
            />
          ) : (
            <EmailInputForm
              title="Login"
              errorMessage={sendOTPError}
              handleSubmit={handleLoginSubmit}
              isSubmitting={isSendingOTP}
              validateEmail={validateEmail}
              titleAlignment="center"
              onClearError={resetSendOTP}
            />
          )}
        </div>
      </div>
    </div>
  )
} 


