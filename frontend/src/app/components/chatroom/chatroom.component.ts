import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit {
  messages: any[] = [];
  usersStatus: any = {};
  messageInput: string = '';
  receiver: string = '';
  sender: string = '';

  constructor(
    private socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the current user's ID from AuthService
    this.sender = this.authService.getUserId();

    // Listen for incoming messages
    this.socketService.getMessages().subscribe((message) => {
      this.messages.push(message);
    });

    // Listen for status updates
    this.socketService.getStatusUpdates().subscribe((status) => {
      this.usersStatus = status;
    });
  }

  // Send a message
  sendMessage(): void {
    if (this.messageInput.trim()) {
      this.socketService.sendMessage(
        this.sender,
        this.receiver,
        this.messageInput
      );
      this.messageInput = ''; // Clear input after sending
    }
  }

  // Update user status
  updateStatus(status: string): void {
    this.socketService.updateStatus(status);
  }

  // Set receiver dynamically (could be based on user selection)
  setReceiver(userId: string): void {
    this.receiver = userId;
  }
}
