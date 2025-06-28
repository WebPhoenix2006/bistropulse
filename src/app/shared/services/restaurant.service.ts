import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from 'express';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com';
  http = inject(HttpClient);

  uploadRestaurant(data: FormData) {
    return this.http.post(`${this.BASE_URL}/api/restaurants/`, data);
  }

  getRestaurants() {
    return this.http.get(`${this.BASE_URL}/restaurants`);
  }
}
