import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../shared/services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false,
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  selectedUserId: number = 0; // Replace with the ID of the user being chatted with
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService
      .pollMessagesWithUser(this.selectedUserId, 3000)
      .subscribe((data: any) => {
        this.messages = data;
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService
      .sendMessage({ receiver: this.selectedUserId, content: this.newMessage })
      .subscribe(() => {
        this.newMessage = '';
      });
  }
}
