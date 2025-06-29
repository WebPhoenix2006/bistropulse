import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Token ${token}`,
    });
  }

  uploadRestaurant(data: FormData) {
    return this.http.post(`${this.BASE_URL}/restaurants/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getRestaurants() {
    return this.http.get(`${this.BASE_URL}/restaurants/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
