// chat-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  users: any[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.chatService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
