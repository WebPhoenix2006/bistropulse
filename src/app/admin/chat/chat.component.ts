import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { Subject, interval, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Interfaces for type safety
interface Contact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: number;
  text?: string;
  image?: string;
  file?: {
    name: string;
    url: string;
    type: string;
    size: number;
  };
  fromMe: boolean;
  time: string;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  isNew?: boolean;
}

interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  is_online?: boolean;
  last_seen?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false,
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatHistory', { static: false }) chatHistory!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  // Core properties
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  currentUserId: number = 0;

  // UI State properties
  isLoading: boolean = false;
  isTyping: boolean = false;
  showEmojiPicker: boolean = false;
  selectedImage: string | null = null;

  // Typing functionality
  private typingSubject = new Subject<string>();
  private typingSubscription?: Subscription;
  private refreshSubscription?: Subscription;
  private shouldScrollToBottom: boolean = false;

  // Popular emojis for emoji picker
  popularEmojis: string[] = [
    '😀',
    '😂',
    '😍',
    '😘',
    '😊',
    '😎',
    '😢',
    '😭',
    '😡',
    '😱',
    '😴',
    '🤔',
    '👍',
    '👎',
    '👌',
    '✌️',
    '🤝',
    '🙏',
    '❤️',
    '💔',
    '💯',
    '🔥',
    '⭐',
    '🎉',
  ];

  constructor(private http: HttpClient, private authService: AuthService) {
    // Setup typing detection
    this.typingSubscription = this.typingSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        // Here you would typically emit typing status to WebSocket
        console.log('User is typing...');
      });
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    if (!this.currentUserId) {
      console.error('No current user ID found');
      return;
    }

    this.loadContacts();
    this.startPeriodicRefresh();
  }

  ngOnDestroy(): void {
    this.typingSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // Authentication and HTTP helpers
  getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Contact management
  loadContacts(): void {
    this.isLoading = true;

    this.http
      .get<any>('https://bistropulse-backend.onrender.com/api/users/', {
        headers: this.getAuthHeaders(),
      })
      .subscribe({
        next: (response) => {
          const users: User[] = response.results ?? response;

          const contactPromises = users
            .filter((user: User) => user.id !== this.currentUserId)
            .map(async (user: User) => {
              const name = user.username;
              let lastMessage = 'No messages yet';
              let time = '';

              try {
                const res: any = await this.http
                  .get(
                    `https://bistropulse-backend.onrender.com/api/chat/messages/?user=${user.id}&limit=1&ordering=-timestamp`,
                    {
                      headers: this.getAuthHeaders(),
                    }
                  )
                  .toPromise();

                const messages = res.results ?? res;
                if (messages.length > 0) {
                  const msg = messages[0];
                  lastMessage = msg.content || '[media]';
                  time = this.formatMessageTime(msg.timestamp);
                }
              } catch (err) {
                console.error(`Failed to fetch last message for ${name}`, err);
              }

              return {
                id: user.id,
                name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=6366f1&color=ffffff&size=128`,
                lastMessage,
                time,
                isOnline: user.is_online || false,
                lastSeen: user.last_seen || 'Never',
              };
            });

          Promise.all(contactPromises).then((contacts) => {
            this.contacts = contacts;
            this.loadSavedContact(); // Load the previously selected contact
            this.isLoading = false;
          });

          // Load saved contact after contacts have been loaded
          this.loadSavedContact();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load users', err);
          this.isLoading = false;
        },
      });
  }

  private loadSavedContact(): void {
    try {
      const saved = localStorage.getItem('selectedContact');
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = this.contacts.find((c) => c.id === parsed.id);
        if (found) {
          this.selectedContact = found;
          this.loadMessages(found.id);
        }
      }
    } catch (error) {
      console.error('Error loading saved contact:', error);
      localStorage.removeItem('selectedContact');
    }
  }

  selectContact(contact: Contact): void {
    this.selectedContact = contact;
    localStorage.setItem('selectedContact', JSON.stringify(contact));
    this.loadMessages(contact.id);
    this.markMessagesAsRead();
  }

  // Message management
  loadMessages(receiverId: number): void {
    this.isLoading = true;

    this.http
      .get<any>(
        `https://bistropulse-backend.onrender.com/api/chat/messages/?user=${receiverId}`,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (res) => {
          const results = res.results ?? res;
          const previousLength = this.messages.length;

          this.messages = results.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            fromMe: msg.sender === this.currentUserId,
            time: this.formatMessageTime(msg.timestamp),
            timestamp: msg.timestamp,
            status:
              msg.sender === this.currentUserId
                ? this.getMessageStatus(msg)
                : undefined,
            isNew: false,
          }));

          // Scroll to bottom if this is initial load or new messages
          if (previousLength === 0 || this.messages.length > previousLength) {
            this.shouldScrollToBottom = true;
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to fetch messages', err);
          this.isLoading = false;
        },
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedContact || this.isLoading) {
      return;
    }

    const messageContent = this.newMessage.trim();
    const messageData = {
      receiver: this.selectedContact.id,
      content: messageContent,
    };

    // Optimistically add message to UI
    const tempMessage: Message = {
      id: Date.now(), // Temporary ID
      text: messageContent,
      fromMe: true,
      time: this.formatMessageTime(new Date().toISOString()),
      status: 'sent',
      isNew: true,
    };

    this.messages.push(tempMessage);
    this.newMessage = '';
    this.shouldScrollToBottom = true;

    // Send to server
    this.http
      .post<any>(
        'https://bistropulse-backend.onrender.com/api/chat/messages/',
        messageData,
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: (msg: any) => {
          // Replace temporary message with server response
          const index = this.messages.findIndex((m) => m.id === tempMessage.id);
          if (index !== -1) {
            this.messages[index] = {
              id: msg.id,
              text: msg.content,
              fromMe: true,
              time: this.formatMessageTime(msg.timestamp),
              timestamp: msg.timestamp,
              status: 'delivered',
              isNew: false,
            };
          }

          // Update contact's last message
          if (this.selectedContact) {
            this.selectedContact.lastMessage = messageContent;
            this.selectedContact.time = this.formatMessageTime(msg.timestamp);
          }
        },
        error: (err) => {
          console.error('Error sending message:', err);
          // Remove failed message or mark as failed
          const index = this.messages.findIndex((m) => m.id === tempMessage.id);
          if (index !== -1) {
            this.messages.splice(index, 1);
          }
          // Restore message in input for retry
          this.newMessage = messageContent;
        },
      });
  }

  // File handling
  attachFile(event: any): void {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (this.isImageFile(file)) {
        this.handleImageUpload(file);
      } else {
        this.handleFileUpload(file);
      }
    });

    // Reset file input
    event.target.value = '';
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private handleImageUpload(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;

      // Add image message to UI
      const imageMessage: Message = {
        id: Date.now(),
        image: imageData,
        fromMe: true,
        time: this.formatMessageTime(new Date().toISOString()),
        status: 'sent',
        isNew: true,
      };

      this.messages.push(imageMessage);
      this.shouldScrollToBottom = true;
    };
    reader.readAsDataURL(file);
  }

  private handleFileUpload(file: File): void {
    const fileMessage: Message = {
      id: Date.now(),
      file: {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
      },
      fromMe: true,
      time: this.formatMessageTime(new Date().toISOString()),
      status: 'sent',
      isNew: true,
    };

    this.messages.push(fileMessage);
    this.shouldScrollToBottom = true;
  }

  // UI Event handlers
  onTyping(): void {
    this.typingSubject.next(this.newMessage);
  }

  onInputFocus(): void {
    this.markMessagesAsRead();
  }

  onInputBlur(): void {
    // Handle input blur if needed
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  closeEmojiPicker(): void {
    this.showEmojiPicker = false;
  }

  insertEmoji(emoji: string): void {
    this.newMessage += emoji;
    this.closeEmojiPicker();
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  openImageModal(imageSrc: string): void {
    this.selectedImage = imageSrc;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }

  viewProfile(contact: Contact): void {
    console.log('View profile for:', contact.name);
    // Implement profile view logic
  }

  openNewChatModal(): void {
    console.log('Opening new chat modal');
    // Implement new chat modal logic
  }

  // Utility methods
  trackByContactId(index: number, contact: Contact): number {
    return contact.id;
  }

  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }

  formatMessage(text: string): string {
    // Simple URL detection and conversion to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  formatMessageTime(timestamp: string): string {
    try {
      if (!timestamp) return '';

      // Replace space with T to create ISO format
      const isoTimestamp = timestamp.replace(' ', 'T');

      const date = new Date(isoTimestamp);

      if (isNaN(date.getTime())) {
        // console.warn('Invalid date received:', timestamp);
        return timestamp;
      }

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHour = hours % 12 || 12;
      const formattedMinute = minutes.toString().padStart(2, '0');

      return `${formattedHour}:${formattedMinute} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return 'fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document'))
      return 'fa-file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet'))
      return 'fa-file-excel';
    if (fileType.includes('image')) return 'fa-file-image';
    if (fileType.includes('video')) return 'fa-file-video';
    if (fileType.includes('audio')) return 'fa-file-audio';
    return 'fa-file';
  }

  getMessageStatus(message: any): 'sent' | 'delivered' | 'read' {
    // This would typically come from your API
    if (message.read_at) return 'read';
    if (message.delivered_at) return 'delivered';
    return 'sent';
  }

  getMessageStatusText(status: string): string {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
      default:
        return '';
    }
  }

  onImageError(event: any): void {
    // Fallback to default avatar if image fails to load
    const target = event.target;
    if (target.src.includes('ui-avatars.com')) {
      target.src = 'assets/images/default-avatar.png'; // Fallback image
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatHistory) {
        const element = this.chatHistory.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }

  private markMessagesAsRead(): void {
    if (!this.selectedContact) return;

    // Mark messages as read - this would typically be an API call
    this.messages.forEach((message) => {
      if (!message.fromMe && message.status !== 'read') {
        message.status = 'read';
      }
    });
  }

  private startPeriodicRefresh(): void {
    // Refresh messages every 30 seconds when a contact is selected
    this.refreshSubscription = interval(30000).subscribe(() => {
      if (this.selectedContact && !this.isLoading) {
        this.loadMessages(this.selectedContact.id);
      }
    });
  }

  // Method to handle clicks outside emoji picker
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.emoji-picker') &&
      !target.closest('[for="emoji-picker"]')
    ) {
      this.closeEmojiPicker();
    }
  }
}
