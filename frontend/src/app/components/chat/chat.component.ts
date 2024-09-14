import { MessageService } from './../../services/message.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { Subscription } from 'rxjs';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, InputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnChanges {
  @Input() selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';

  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  userId: string = this.decodedToken.id;

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser'] && this.selectedUser) {
      this.loadMessages();
    }
  }

  loadMessages(): void {
    if (this.selectedUser) {
      this.messageService.getMessages(this.selectedUser.id).subscribe(
        (data) => {
          this.messages = data;
        },
        (error) => {
          console.error('Error loading messages:', error);
        }
      );
    }
  }

  sendMessage(): void {
    if (this.newMessage && this.selectedUser) {
      const senderId = this.userId;
      const receiverId = this.selectedUser.id;
      const content = this.newMessage;

      this.messageService.sendMessage(senderId, receiverId, content).subscribe(
        (response) => {
          if (response) {
            this.loadMessages();
            this.newMessage = '';
          }
        },
        (error) => {
          console.error('Error sending message:', error);
        }
      );
    }
  }
}
