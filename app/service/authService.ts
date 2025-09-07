// services/authService.ts - Business logic layer
import AuthKeyService from '../lib/authkey';
import type { OTPResponse, OTPVerification, StoredOTP } from '../models/helpers/authTypes';
import type { SchoolInstitute } from '../models/schoolInstitute';
import { SchoolInstituteRepository } from '../repository/schoolInstituteRepository';

class AuthService {

  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(email: string): Promise<OTPResponse & { otp?: string }> {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      
      // Send OTP via AuthKey
      const success = await AuthKeyService.sendOTP(email, otp);
      // const success = true;
      console.log("OTP sent successfully", otp);
      
      if (success) {
        // For development environment, include the OTP in the response
        const isDev = process.env.NODE_ENV === 'development';
        return { 
          success: true, 
          message: 'OTP sent successfully',
          ...(isDev && { otp }) // Only include OTP in development
        };
      } else {
        return { success: false, message: 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Auth Service Error:', error);
      return { success: false, message: 'Error sending OTP' };
    }
  }

  /**
   * Verifies the OTP entered by the user against the stored OTP
   */
  static verifyOTP(enteredOTP: string, storedOTP: StoredOTP): OTPVerification {
    if (!storedOTP) {
      return { success: false, message: 'OTP not found or expired' };
    }
    
    if (Date.now() > storedOTP.expiresAt) {
      return { success: false, message: 'OTP expired' };
    }
    
    if (storedOTP.otp === enteredOTP) {
      return { success: true, message: 'OTP verified successfully' };
    }
    
    return { success: false, message: 'Invalid OTP' };
  }

  /**
   * Creates a user object from email (used after successful verification)
   * for now its just the duplication but in future if need we can expand it
   */
  static createUserFromEmail(email: string) {
    return {
      id: email,
      email: email,
      name: email.split('@')[0] // Extract name from email
    };
  }

  /**
   * Checks if an email exists in the school institute database and returns the institute data.
   */
  static async checkEmailExistence(email: string): Promise<SchoolInstitute | null> {
    try {
      const schoolRepository = new SchoolInstituteRepository();
      const schoolInstitute = await schoolRepository.getByEmail(email);
      return schoolInstitute; // Returns the actual data or null
    } catch (error) {
      console.error('Auth Service Error: Failed to check email existence', error);
      throw new Error('Error checking email existence. Please try again.');
    }
  }
}

export default AuthService;