import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from 'express';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  http = inject(HttpClient);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    });
  }

  uploadRestaurant(data: FormData) {
    return this.http.post(`${this.BASE_URL}/restaurants/`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getRestaurants() {
    return this.http.get(`${this.BASE_URL}/restaurants`);
  }
}
