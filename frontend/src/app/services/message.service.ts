import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(
    senderId: string,
    receiverId: string,
    content: string
  ): Observable<any> {
    return this.http.post<boolean>(`${this.apiUrl}/send`, {
      senderId,
      receiverId,
      content,
    });
  }

  getMessages(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/private/${userId}`);
  }
}
