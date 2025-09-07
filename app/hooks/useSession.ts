'use client';

import { useSession as useNextAuthSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { DashboardType } from '../models/schoolInstitute';

interface SessionUser {
  email: string;
  name: string;
  userType: DashboardType;
  instituteId: string;
}

interface UseSessionResult {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  redirectToLogin: () => void;
}

export const useSession = (): UseSessionResult => {
  const { data: session, status } = useNextAuthSession();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/login' 
      });
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect to login even if signOut fails
      router.push('/login');
    }
  }, [router]);

  const redirectToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const user: SessionUser | null = session?.user ? {
    email: session.user.email,
    name: session.user.name,
    userType: session.user.userType,
    instituteId: session.user.instituteId
  } : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    logout,
    redirectToLogin,
  };
}; 