import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
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
   * Convert RestaurantSubmit data into FormData for file + nested support
   */
  private buildFormData(data: RestaurantSubmit): FormData {
    const formData = new FormData();

    // Basic restaurant info
    formData.append('name', data.restaurantName);
    formData.append('phone', String(data.restaurantNumber)); // ✅ number → string
    formData.append('location', data.location);
    formData.append('working_period', data.workingPeriod);
    formData.append('large_option', data.largeOption);
    formData.append('established_date', data.establishedDate);

    // Files
    if (data.restaurantImage) {
      formData.append('restaurant_image', data.restaurantImage);
    }

    if (data.businessLicense) {
      formData.append('business_license', data.businessLicense);
    }

    if (data.ownerNID) {
      formData.append('owner_nid', data.ownerNID);
    }

    // Nested Representative object (Django-style dot notation)
    formData.append(
      'representative.full_name',
      data.representativeInfo.representativeName
    );
    formData.append(
      'representative.phone',
      String(data.representativeInfo.representativeNumber)
    ); // ✅ number → string
    formData.append(
      'representative.location',
      data.representativeInfo.representativeLocation
    );

    if (data.representativeInfo.representativeImage) {
      formData.append(
        'representative.photo',
        data.representativeInfo.representativeImage
      );
    }

    return formData;
  }

  /**
   * Upload a new restaurant with nested representative & image fields
   */
  uploadRestaurant(data: RestaurantSubmit): Observable<any> {
    const formData = this.buildFormData(data);
    const headers = this.getAuthHeaders(true); // ✅ Don't manually set Content-Type for FormData
    return this.http.post(`${this.BASE_URL}/restaurants/`, formData, {
      headers,
    });
  }

  /**
   * Get all restaurants for the logged-in user
   */
  getRestaurants(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/restaurants/`, { headers });
  }

  /**
   * Get a single restaurant by ID
   */
  getRestaurant(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.BASE_URL}/restaurants/${id}/`, { headers });
  }

  /**
   * Update a restaurant by ID
   */
  updateRestaurant(id: string, data: RestaurantSubmit): Observable<any> {
    const formData = this.buildFormData(data);
    const headers = this.getAuthHeaders(true);
    return this.http.put(`${this.BASE_URL}/restaurants/${id}/`, formData, {
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

  // *** method for categories ***
  getCategories(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}`);
  }

  addCategories(data: any, id: string): Observable<any> {
    return this.http.post(
      `${this.BASE_URL}/`,
      { data },
      { headers: this.getAuthHeaders() }
    );
  }

  // ** method for foods ***
  addFood(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  getFoods(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/`);
  }
}
