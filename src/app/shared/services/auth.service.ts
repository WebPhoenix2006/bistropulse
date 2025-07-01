import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register/`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login/`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      this.router.navigate(['/auth/login']);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  }
  getUserRole(): string {
  if (isPlatformBrowser(this.platformId)) {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.role || 'admin'; // default to 'admin'
      } catch (error) {
        console.error('Invalid user JSON in localStorage:', error);
        return 'admin'; // fallback if parsing fails
      }
    }
  }
  return 'admin'; // fallback if not in browser or no user data
}

}
