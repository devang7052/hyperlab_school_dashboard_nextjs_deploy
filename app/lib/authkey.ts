// lib/authkey.ts - Your AuthKey service
class AuthKeyService {
    private static readonly AUTH_KEY = '8eb6ed2d3fa13a75';
    private static readonly BASE_URL = 'https://api.authkey.io/request';
    private static readonly TEMPLATE_ID = '578';
    private static readonly COMPANY_NAME = 'HYPERLAB SPORTS PVT LTD';
  
    static async sendOTP(email: string, otp: string): Promise<boolean> {
      const queryParams = new URLSearchParams({
        authkey: this.AUTH_KEY,
        email: email,
        mid: this.TEMPLATE_ID,
        company: this.COMPANY_NAME,
        otp: otp
      });
  
      try {
        const response = await fetch(`${this.BASE_URL}?${queryParams}`, {
          method: 'GET',
        });
        
        return response.ok;
      } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
      }
    }
  }
  
  export default AuthKeyService;