import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false,
})
export class ChatComponent {
  newMessage = '';
  selectedContact: any = null;


  contacts = [
    {
      id: 1,
      name: 'Jason Binoffe',
      avatar: 'assets/images/profile-img.png',
      lastMessage: 'Received, Thanks',
      time: '2:34 PM',
    },
    {
      id: 2,
      name: 'Arun V.',
      avatar: 'assets/images/profile-img.png',
      lastMessage: 'Any updates?',
      time: '2:34 PM',
    },
  ];

  messages: any[] = [];

  selectContact(contact: any) {
    this.selectedContact = contact;
    this.messages = [
      { text: 'Hi, any update on the project?', fromMe: true, time: '6:33 PM' },
      {
        text: 'Yes, I will share the estimate today.',
        fromMe: false,
        time: '6:35 PM',
      },
      {
        image: 'assets/images/restaurant-picture.jpeg',
        fromMe: false,
        time: '6:36 PM',
      },
      {
        file: { name: 'statement2022.pdf', url: '#' },
        fromMe: true,
        time: '6:45 PM',
      },
    ];
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({
      text: this.newMessage,
      fromMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    this.newMessage = '';
  }

  attachFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.messages.push({
        file: { name: file.name, url: '#' },
        fromMe: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }
}
