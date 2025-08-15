import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { categorySubmitInterface } from '../../interfaces/categorysubmit.intrface';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private getAuthHeaders(isFormData = false): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });

    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Token ${token.trim()}`);
    }

    // Only set JSON Content-Type if it's NOT FormData
    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  // *** method for creating food;
  createFood(data: any, id: string): Observable<any> {
    const isFormData = data instanceof FormData;
    return this.http.post(`${this.BASE_URL}/restaurants/${id}/foods/`, data, {
      headers: this.getAuthHeaders(isFormData),
    });
  }

  // *** method for creating category ***
  createCategory(
    data: categorySubmitInterface,
    id: string
  ): Observable<categorySubmitInterface> {
    return this.http.post<categorySubmitInterface>(
      `${this.BASE_URL}/restaurants/${id}/food-categories/`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // *** method for getting categories ***
  getCategories(id: string): Observable<categorySubmitInterface[]> {
    return this.http.get<categorySubmitInterface[]>(
      `${this.BASE_URL}/restaurants/${id}/ food-categories/`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
}
