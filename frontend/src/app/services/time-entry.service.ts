import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TimeEntry {
  id?: string;
  userId: string;
  date: string;
  hours: string;
  description: string;
  type: 'log' | 'event'; // Restrict the type to 'log' or 'event'
}

@Injectable({
  providedIn: 'root',
})
export class TimeEntryService {
  private apiUrl = 'http://localhost:3000/api/time-entries';

  constructor(private http: HttpClient) {}

  // Create a new time entry (log or event)
  createTimeEntry(timeEntry: TimeEntry): Observable<TimeEntry> {
    // Check if it's a 'log' and if the date is in the future
    if (timeEntry.type === 'log' && new Date(timeEntry.date) > new Date()) {
      throw new Error('Cannot create a time log with a future date.');
    }

    return this.http.post<TimeEntry>(this.apiUrl, timeEntry, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get all time entries for a user within a date range
  getTimeEntries(
    userId: string,
    startDate: string,
    endDate: string
  ): Observable<TimeEntry[]> {
    return this.http.get<TimeEntry[]>(
      `${this.apiUrl}?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Update an existing time entry
  updateTimeEntry(id: string, timeEntry: TimeEntry): Observable<TimeEntry> {
    // Prevent updating a 'log' to a future date
    if (timeEntry.type === 'log' && new Date(timeEntry.date) > new Date()) {
      throw new Error('Cannot update a time log to a future date.');
    }

    return this.http.put<TimeEntry>(`${this.apiUrl}/${id}`, timeEntry, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete a time entry
  deleteTimeEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Private method to get authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
