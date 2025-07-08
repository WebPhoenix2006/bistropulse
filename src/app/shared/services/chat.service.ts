import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api/chat';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAuthHeader() {
    const token = this.auth.getToken();
    return { Authorization: `Token ${token}` };
  }

  getMessages(withUserId: number) {
    const params = new HttpParams().set('user', withUserId.toString());
    return this.http.get(`${this.BASE_URL}/messages/`, {
      headers: this.getAuthHeader(),
      params,
    });
  }

  sendMessage(receiver: number, content: string) {
    return this.http.post(
      `${this.BASE_URL}/messages/`,
      { receiver, content },
      { headers: this.getAuthHeader() }
    );
  }
}
