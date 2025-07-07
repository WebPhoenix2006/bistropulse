import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getCommonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  signup(data: any): Observable<any> {
    return this.http
      .post(`${this.BASE_URL}/register/`, data, {
        headers: this.getCommonHeaders(),
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.saveToken(response.token);
          }
          if (response.user) {
            this.saveUserData(response.user); // ✅ Save user & role here too
          }
        }),
        catchError(this.handleError)
      );
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.BASE_URL}/login/`, data, {
        headers: this.getCommonHeaders(),
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.saveToken(response.token);
          }
          if (response.user) {
            this.saveUserData(response.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  saveUserData(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getUserData(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      this.router.navigate(['/auth/login']);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

  getUserRole(): string {
    const user = this.getUserData();
    return user?.role || 'admin'; // Default to 'admin' if no role found
  }

  private handleError(error: any): Observable<never> {
    console.error('AuthService error:', error);
    let errorMessage = 'An unknown error occurred';

    if (error.status === 401) {
      errorMessage = 'Invalid credentials';
      this.logout();
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
