import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = 'http://localhost:3000/api/user';
  private pendingAdminApiUrl = 'http://localhost:3000/api/pending-admins';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    if (userData.role === 'admin') {
      return this.http.post(`${this.pendingAdminApiUrl}/register`, userData, {
        responseType: 'text',
      });
    } else {
      return this.http.post(`${this.userApiUrl}/register`, userData, {
        responseType: 'text',
      });
    }
  }

  checkUserExists(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.userApiUrl}/check-user`, { email });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.userApiUrl}/login`, credentials);
  }

  getUserRole(userId: string) {
    return this.http.get<any>(`${this.userApiUrl}/user-role/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserProfile(userId: string) {
    return this.http.get<any>(`${this.userApiUrl}/profile/${userId}`, {
      headers: this.getAuthHeaders(),
    }); // Make request with headers
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.userApiUrl}/profile/${userId}`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.userApiUrl}/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  isAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.userApiUrl}/is-admin`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Fetch pending admins
  getPendingAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.pendingAdminApiUrl}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  approveAdmin(adminId: number): Observable<any> {
    return this.http.put(
      `${this.pendingAdminApiUrl}/approve-admin/${adminId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  rejectAdmin(adminId: number): Observable<any> {
    return this.http.delete(
      `${this.pendingAdminApiUrl}/reject-admin/${adminId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Add this method to verify Google tokens
  verifyGoogleToken(idToken: string, fromGoogle: boolean = false) {
    return this.http.post('http://localhost:3000/api/user/register-google', { idToken, fromGoogle });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      ContentType: 'application/json',
    });
  }
}
