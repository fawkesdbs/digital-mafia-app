import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly adminRole = 'admin';
  private loginTime: Date | null = null;
  private logoutTime: Date | null = null;

  constructor() {}

  isAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === this.adminRole;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Record login time
  login() {
    this.loginTime = new Date();
    console.log('User logged in at:', this.loginTime);
  }

  // Handle user logout
  logout() {
    if (this.loginTime) {
      this.logoutTime = new Date();
      const sessionDuration =
        (this.logoutTime.getTime() - this.loginTime.getTime()) / 3600000;
      this.saveSessionDuration(sessionDuration);
      this.loginTime = null;
      console.log('User logged out at:', this.logoutTime);
    }

    // Clear calendar events from local storage
    this.clearCalendarEvents();

    // Clear other relevant local storage items
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');

    // Handle other logout logic here
  }

  // Clear calendar events from local storage
  private clearCalendarEvents() {
    console.log('Clearing calendar events from local storage');
    localStorage.removeItem('calendarEvents');
  }

  // Save session duration to local storage
  private saveSessionDuration(duration: number) {
    const dateKey = new Date().toISOString().split('T')[0];
    let sessions = JSON.parse(localStorage.getItem(dateKey) || '[]');
    sessions.push(duration);
    localStorage.setItem(dateKey, JSON.stringify(sessions));
    console.log(`Saved ${duration} hours for date ${dateKey}`);
  }

  // Retrieve session durations from local storage
  getSessionDurations(): { date: string; hours: number }[] {
    const keys = Object.keys(localStorage).filter(
      (key) => !isNaN(Date.parse(key))
    );
    return keys.map((key) => {
      const sessions = JSON.parse(localStorage.getItem(key) || '[]');
      const totalHours = sessions.reduce(
        (sum: number, duration: number) => sum + duration,
        0
      );
      return { date: key, hours: totalHours };
    });
  }

  // Get the current user ID from the JWT token
  getUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken.id;
    }
    return '';
  }

  // Decode the JWT token
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return {};
    }
  }
}
