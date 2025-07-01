import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    if (typeof window !== 'undefined' && localStorage.getItem('auth_token')) {
      const token = localStorage.getItem('auth_token');
      return new HttpHeaders({
        Authorization: `Token ${token}`,
      });
    }

    // Return empty headers if running on server
    return new HttpHeaders();
  }

  uploadCustomer(data: FormData) {
    return this.http.post(`${this.BASE_URL}/customers/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getCustomers(page: number = 1, pageSize: number = 10) {
    return this.http.get(
      `${this.BASE_URL}/customers/?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
