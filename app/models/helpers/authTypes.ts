// types/auth.ts - Type definitions for authentication
import type { DashboardType } from '../schoolInstitute';

export interface OTPResponse {
  success: boolean;
  message: string;
}

export interface OTPVerification {
  success: boolean;
  message: string;
}

export interface StoredOTP {
  otp: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  userType?: DashboardType;
  instituteId?: string;
}

export interface LoginFormData {
  email: string;
}

export interface OTPFormData {
  otp: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

declare module "next-auth" {
  interface User extends AuthUser {
    userType?: DashboardType;
    instituteId?: string;
  }

  interface Session {
    user: {
      email: string;
      name: string;
      userType: DashboardType;
      instituteId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType?: DashboardType;
    instituteId?: string;
  }
} 