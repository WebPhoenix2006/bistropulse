import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Franchise } from '../../interfaces/franchise.interface';

@Injectable({
  providedIn: 'root'
})
export class FranchisesService {
  base_url: string = 'https://bistropulse-backend.onrender.com/api/franchises/';

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

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFranchises(): Observable<Franchise[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Franchise[]>(this.base_url, {
      headers
    });
  }
}
