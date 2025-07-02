``;
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  http = inject(HttpClient);
  private authService = inject(AuthService);

  private getAuthHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    headers = headers.set('Accept', 'application/json');

    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Token ${token.trim()}`);
    }

    return headers;
  }

  uploadRestaurant(data: FormData) {
    return this.http.post(`${this.BASE_URL}/restaurants/`, data, {
      headers: this.getAuthHeaders(true), // Avoid setting Content-Type manually for FormData
    });
  }

  getRestaurants() {
    return this.http.get(`${this.BASE_URL}/restaurants/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
