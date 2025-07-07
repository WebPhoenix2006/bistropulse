import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private BASE_URL = 'https://bistropulse-backend.onrender.com/api';
  constructor(private http: HttpClient) {}

  sendMessage(messageData: {receiver: number, content: string}) {
    return this.http.post(`${this.BASE_URL}/messages`, messageData)
  }
  getMessagesWithUser(userId: number) {
    return this.http.get(`${this.BASE_URL}/messages/user/${userId}/`);
  }

  pollMessagesWithUser(userId: number, intervalMs: number = 5000): Observable<any> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getMessagesWithUser(userId))
    );
  }

}
