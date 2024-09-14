// message-input.component.ts
import { Component, Input } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-input',
  standalone: true,
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css'],
  imports: [FormsModule, CommonModule],
})
export class MessageInputComponent {
  @Input() receiverId: number = 0;  // Declare receiverId as an @Input
  content: string = '';

  constructor(private chatService: ChatService) {}

  sendMessage() {
    if (this.content.trim()) {
      const message = {
        receiverId: this.receiverId,
        content: this.content
      };

      this.chatService.sendMessage(message).subscribe(() => {
        this.content = '';  // Clear input after sending
      });
    }
  }
}
