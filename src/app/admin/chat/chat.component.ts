import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false,
})
export class ChatComponent implements OnInit {
  contacts: any[] = [];
  selectedContact: any = null;
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: number = 0;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    if (!this.currentUserId) return;

    this.loadContacts();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Token ${token}`,
    });
  }

  loadContacts(): void {
    this.http
      .get<any>('https://bistropulse-backend.onrender.com/api/users/', {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          const users = response.results ?? response;

          this.contacts = users
            .filter((user: any) => user.id !== this.currentUserId)
            .map((user: any) => {
              const fullName = `${user.first_name || ''} ${
                user.last_name || ''
              }`.trim();
              const name = fullName || user.username;

              return {
                id: user.id,
                name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}`,
                lastMessage: '',
                time: '',
              };
            });

          // ✅ Load saved contact AFTER contacts have been loaded
          const saved = localStorage.getItem('selectedContact');
          if (saved) {
            const parsed = JSON.parse(saved);
            const found = this.contacts.find((c) => c.id === parsed.id);
            if (found) {
              this.selectedContact = found;
              this.loadMessages(found.id);
            }
          }
        },
        error: (err) => {
          console.error('Failed to load users', err);
        },
      });
  }

  selectContact(contact: any): void {
    this.selectedContact = contact;
    localStorage.setItem('selectedContact', JSON.stringify(contact));
    this.loadMessages(contact.id);
  }

  loadMessages(receiverId: number): void {
    this.http
      .get<any>(
        `https://bistropulse-backend.onrender.com/api/chat/messages/?user=${receiverId}`,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (res) => {
          const results = res.results ?? res;

          this.messages = results.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            fromMe: msg.sender === this.currentUserId,
            time: new Intl.DateTimeFormat('en-NG', {
              timeZone: 'Africa/Lagos',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }).format(new Date(msg.timestamp)),
          }));
        },
        error: (err) => {
          console.error('Failed to fetch messages', err);
        },
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedContact) return;

    const messageData = {
      receiver: this.selectedContact.id,
      content: this.newMessage,
    };

    this.http
      .post(
        'https://bistropulse-backend.onrender.com/api/chat/messages/',
        messageData,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (msg: any) => {
          this.messages.push({
            id: msg.id,
            text: msg.content,
            fromMe: true,
            time: new Intl.DateTimeFormat('en-NG', {
              timeZone: 'Africa/Lagos',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }).format(new Date(msg.timestamp)),
          });
          this.newMessage = '';
        },
        error: (err) => {
          console.error('Error sending message:', err);
        },
      });
  }

  attachFile(event: any): void {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    // Extend later to support file sending
  }
}
