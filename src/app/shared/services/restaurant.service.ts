import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // adjust path if needed
import { RestaurantSubmit } from '../../interfaces/restaurant-submit.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';

  /**
   * Dynamically generate authorization headers.
   * @param isFormData - true if sending FormData
   */
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

  /**
   * Upload new restaurant using FormData
   */
  uploadRestaurant(data: RestaurantSubmit): Observable<any> {
    const headers = this.getAuthHeaders(true); // skip setting content-type
    return this.http.post(`${this.BASE_URL}/restaurants/`, data, { headers });
  }

  /**
   * Get all restaurants for logged-in user
   */
  getRestaurants(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/restaurants/`, { headers });
  }

  /**
   * Get restaurant by ID
   */
  getRestaurant(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/restaurants/${id}/`, { headers });
  }

  /**
   * Update a restaurant by ID
   */
  updateRestaurant(id: string, data: FormData): Observable<any> {
    const headers = this.getAuthHeaders(true);
    return this.http.put(`${this.BASE_URL}/restaurants/${id}/`, data, {
      headers,
    });
  }

  /**
   * Delete a restaurant by ID
   */
  deleteRestaurant(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.BASE_URL}/restaurants/${id}/`, { headers });
  }
}
