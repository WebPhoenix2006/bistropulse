import { Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { categorySubmitInterface } from '../../interfaces/categorysubmit.intrface';

@Injectable({
  providedIn: 'root',
})
export class AddOrderService {
  BASE_URL = enviroment.apiUrl;
  constructor(private authService: AuthService, private http: HttpClient) {}

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

  getCategories(id: string): Observable<categorySubmitInterface[]> {
    return this.http.get<categorySubmitInterface[]>(
      `${this.BASE_URL}/restaurants/${id}/food-categories/`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getFoods(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/restaurants/${id}/foods/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
