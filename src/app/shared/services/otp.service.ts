import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OtpService {
  private readonly BASE_URL =
    'https://bistropulse-backend.onrender.com/api/users/role-otps/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeader() {
    const token = this.auth.getToken();
    return token ? { Authorization: `Token ${token}` } : {}; // return empty if no token
  }

  getOtps() {
    const headers = this.getAuthHeader();
    return this.http.get(this.BASE_URL, { headers });
  }

  addOtp(otp: string, role: string) {
    const headers = this.getAuthHeader();
    return this.http.post(this.BASE_URL, { otp, role }, { headers });
  }
}
