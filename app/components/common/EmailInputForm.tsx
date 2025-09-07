// app/components/common/EmailInputForm.tsx - Generalized email input form component
'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/app/components/common/loadingSpinner';

interface EmailInputFormProps {
  title: string;
  errorMessage?: string | null;
  handleSubmit: (e: React.FormEvent, email: string) => void;
  isSubmitting: boolean;
  validateEmail: (email: string) => boolean;
  titleAlignment?: 'left' | 'center';
  onClearError: () => void;
}

export default function EmailInputForm({
  title,
  errorMessage,
  handleSubmit,
  isSubmitting,
  validateEmail,
  titleAlignment = 'left',
  onClearError,
}: EmailInputFormProps) {
  const [email, setEmail] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(false)
  
  useEffect(() => {
    setIsValidEmail(validateEmail(email.trim()))
  }, [email, validateEmail])

  return (
    <div className="mt-8 space-y-6">
      <h2 className={`text- text-4xl  font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] mb-18 ${titleAlignment === 'center' ? 'text-center' : 'text-left'}`}>
        {title}
      </h2>
      <form onSubmit={(e) => handleSubmit(e, email)}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-2xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-700)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            required
            className="appearance-none relative block w-full px-3 py-4 border border-[var(--neutral-40)] hover:bg-[var(--background-hover)] text-[var(--neutral-700)] font-['MADE_Outer_Sans_Light']  text-lg"
            
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value === '') {
                onClearError();
              }
            }}
            disabled={isSubmitting}
          />
        </div>

        {errorMessage && isValidEmail && (
          <div className="text-[var(--error-500)] text-md mt-2 font-['MADE_Outer_Sans_Light'] font-medium">
            {errorMessage}
          </div>
        )}

        <div className="mt-12">
          <button
            type="submit"
            disabled={isSubmitting || !isValidEmail}
            className={`w-full flex justify-center py-4 px-4 border border-transparent text-xl font-['MADE_Outer_Sans_Light'] 
              ${(isSubmitting || !isValidEmail)
                ? 'bg-[var(--neutral-80)] cursor-not-allowed text-[var(--neutral-40)]'
                : "bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-[var(--neutral-10)] cursor-pointer " 
              } 
              transition-colors duration-200`}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size={23} borderWidth={2.2} color='border-white' />
              </>
            ) : (
              "CONTINUE"
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 