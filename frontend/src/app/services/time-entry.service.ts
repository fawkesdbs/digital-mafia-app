import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TimeEntry {
  id?: string;
  userId: string;
  date: string;
  hours: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TimeEntryService {
  private apiUrl = 'http://localhost:3000/api/time-entries';
  constructor(private http: HttpClient) {}

  createTimeEntry(timeEntry: TimeEntry): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(this.apiUrl, timeEntry, {
      headers: this.getAuthHeaders(),
    });
  }

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

  updateTimeEntry(id: string, timeEntry: TimeEntry): Observable<TimeEntry> {
    return this.http.put<TimeEntry>(`${this.apiUrl}/${id}`, timeEntry, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteTimeEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      ContentType: 'application/json',
    });
  }
}
