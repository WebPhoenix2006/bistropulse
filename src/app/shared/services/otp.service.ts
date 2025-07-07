import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api/users';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAuthHeader() {
    const token = this.auth.getToken();
    return token
      ? { Authorization: `Token ${token}` }
      : {}; // return empty headers if token is missing
  }

  getOtps() {
    const headers = this.getAuthHeader();
    return this.http.get(`${this.BASE_URL}/role-otps/`, { headers });
  }

  addOtp(otp: string, role: string) {
    const headers = this.getAuthHeader();
    return this.http.post(
      `${this.BASE_URL}/role-otps/`,
      { otp, role },
      { headers }
    );
  }
}
