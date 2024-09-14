// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000'; // Your backend URL

  constructor(private http: HttpClient) {}

  // Fetch users to chat with
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Fetch messages between the current user and the selected user
  getMessages(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/message/private/${userId}`);
  }

  // Send a message
  sendMessage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/message/send`, data);
  }
}
