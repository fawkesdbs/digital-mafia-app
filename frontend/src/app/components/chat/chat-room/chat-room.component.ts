// chat-room.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule,MessageInputComponent],
})
export class ChatRoomComponent implements OnInit {
  @Input() selectedUserId: number = 0;
  messages: any[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages() {
    if (this.selectedUserId) {
      this.chatService.getMessages(this.selectedUserId).subscribe((data) => {
        this.messages = data;
      });
    }
  }
}
