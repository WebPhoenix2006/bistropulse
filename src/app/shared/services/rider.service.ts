import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RiderService {
  constructor() {}

  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const token = this.authService.getToken();
    if (token) {
      return headers.set('Authorization', `Token ${token.trim()}`);
    }
    return headers;
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.authService.logout();
      return throwError(
        () => new Error('Session expired. Please login again.')
      );
    }
    return throwError(() => new Error(error.message || 'Server error'));
  }

  uploadRiders(data: FormData) {
    const headers = this.getAuthHeaders()
      .delete('Content-Type') // Remove for FormData
      .set('Accept', '*/*');

    return this.http.post(`${this.BASE_URL}/riderss/`, data, { headers });
  }
  // Get restaurant by
  getRestaurant(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/restaurants/${id}/`, { headers });
  }

  getRiders(page: number = 1, pageSize: number = 10) {
    return this.http.get(
      `${this.BASE_URL}/riders/?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getRidersById(id: string) {
    return this.http.get(`${this.BASE_URL}/riders/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }
  updateRider(riderId: string, data: any) {
    const encodedId = encodeURIComponent(riderId); // ⬅️ THIS IS IMPORTANT
    return this.http.put(`${this.BASE_URL}/riders/${encodedId}/`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}
