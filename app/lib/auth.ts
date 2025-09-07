// lib/auth.ts - NextAuth configuration
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import AuthService from '../service/authService'
import type { AuthUser } from '../models/helpers/authTypes'
import type { DashboardType } from '../models/schoolInstitute'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'email-otp',
      name: 'Email OTP',
      credentials: {
        
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
        userType: { label: 'UserType', type: 'text' },
        instituteId: { label: 'InstituteId', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error('Email and OTP are required')
        }

        // Get the institute data to retrieve the instituteId
        const schoolInstitute = await AuthService.checkEmailExistence(credentials.email);
        
        if (!schoolInstitute) {
          throw new Error('This email is not registered with any organization');
        }

        const user: AuthUser = AuthService.createUserFromEmail(credentials.email);
        
        // Add userType and instituteId to the user object
        user.userType = schoolInstitute.userType;
        user.instituteId = schoolInstitute.id;
        
        return user;
      }
    })
  ],
  
  pages: {
    signIn: '/login',
    error: '/login'
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.userType = user.userType
        token.instituteId = user.instituteId
      }
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email as string,
          name: token.name as string,
          userType: token.userType as DashboardType,
          instituteId: token.instituteId as string
        }
      }
      return session
    }
  },
  
  secret: process.env.NEXTAUTH_SECRET ,
} 