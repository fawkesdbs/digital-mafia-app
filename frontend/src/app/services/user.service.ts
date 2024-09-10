import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      responseType: 'text',
    });
  }

  checkUserExists(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-user`, { email });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  getUserProfile() {
    const token = localStorage.getItem('authToken'); // Fetch the token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Add token to headers
    return this.http.get<any>(`${this.apiUrl}/user-role`, { headers }); // Make request with headers
  }

  updateUserProfile(userProfile: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, userProfile, {
      headers: this.getAuthHeaders(),
    });
  }

  isAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-admin`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch pending admins
  getPendingAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending-admins`);
  }

  approveAdmin(adminId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/approve-admin/${adminId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  rejectAdmin(adminId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reject-admin/${adminId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserRole(email: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user-role?email=${email}`);
  }
}
