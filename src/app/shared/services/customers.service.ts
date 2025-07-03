import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
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

  uploadCustomer(data: FormData) {
    const headers = this.getAuthHeaders()
      .delete('Content-Type') // Remove for FormData
      .set('Accept', '*/*');

    return this.http.post(`${this.BASE_URL}/customers/`, data, { headers });
  }

  getCustomers(page: number = 1, pageSize: number = 10) {
    return this.http.get(
      `${this.BASE_URL}/customers/?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getCustomerById(id: string) {
    return this.http.get(`${this.BASE_URL}/customers/${id}/`, {
      headers: this.getAuthHeaders(),
    });
  }
  updateCustomer(customerId: string, data: any) {
    const encodedId = encodeURIComponent(customerId); // ⬅️ THIS IS IMPORTANT
    return this.http.put(`${this.BASE_URL}/customers/${encodedId}/`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}
