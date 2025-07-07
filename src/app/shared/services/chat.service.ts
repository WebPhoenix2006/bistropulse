import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private base = 'https://your-api-url/api';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(`${this.base}/users/`);
  }

  getMessages(userId: number) {
    return this.http.get<any[]>(`${this.base}/chat/${userId}/`);
  }

  sendMessage(receiverId: number, content: string) {
    return this.http.post(`${this.base}/chat/`, {
      receiver: receiverId,
      content,
    });
  }
}
