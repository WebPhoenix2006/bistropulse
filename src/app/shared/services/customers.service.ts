import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Token ${token}`,
    });
  }

  uploadCustomer(data: FormData) {
    return this.http.post(`${this.BASE_URL}/customers/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getCustomers() {
    return this.http.get(`${this.BASE_URL}/customers/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
