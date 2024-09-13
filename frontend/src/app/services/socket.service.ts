import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:3000');  // Ensure this URL matches your backend
  }

  // Emit status update (online/offline/dnd)
  updateStatus(status: string): void {
    this.socket.emit('updateStatus', status);
  }

  // Listen for status updates
  getStatusUpdates(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('statusUpdate', (usersStatus: any) => {
        observer.next(usersStatus);
      });
    });
  }

  // Send a message
  sendMessage(sender: string, receiver: string, message: string): void {
    this.socket.emit('message', { sender, receiver, message });
  }

  // Listen for incoming messages
  getMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (message: any) => {
        observer.next(message);
      });
    });
  }
}
