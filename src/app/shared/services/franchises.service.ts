import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Franchise } from '../../interfaces/franchise.interface';
import { BranchSubmit } from '../../interfaces/branchsubmit.interface';

@Injectable({
  providedIn: 'root',
})
export class FranchisesService {
  base_url: string = 'https://bistropulse-backend.onrender.com/api/franchises';

  private getAuthHeaders(
    useForFormData: boolean = false
  ): HttpHeaders | undefined {
    const token = this.authService.getToken();
    if (!token) return undefined;

    const headers = new HttpHeaders({
      Authorization: `Token ${token.trim()}`,
    });

    // Don't add Content-Type if it's for FormData - let browser set it automatically
    return useForFormData
      ? headers
      : headers.set('Content-Type', 'application/json');
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFranchises(): Observable<Franchise[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Franchise[]>(this.base_url, {
      headers,
    });
  }

  getBranches(id: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.base_url}/${id}/branches`, {
      headers,
    });
  }

  addBranch(id: string, data: any): Observable<any> {
    const url = `${this.base_url}/${id}/branches/`;
    // FIXED: Use useForFormData=true to avoid setting Content-Type
    const headers = this.getAuthHeaders(true);
    return this.http.post(url, data, { headers });
  }

  addFranchise(data: any): Observable<any> {
    return this.http.post(`${this.base_url}/`, data, {
      headers: this.getAuthHeaders(true),
    });
  }
}

