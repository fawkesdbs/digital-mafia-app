import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CalendarWidgetComponent } from '../../components/calendar-widget/calendar-widget.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import { TimeEntry, TimeEntryService } from '../../services/time-entry.service';
import { InputComponent } from '../../components/input/input.component';
import { addHours } from 'date-fns';
import { catchError, of } from 'rxjs';
import { GoogleAuthService } from '../../services/google-auth.service'; // Import GoogleAuthService

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule, CalendarWidgetComponent, InputComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  monthView: CalendarView = CalendarView.Month;
  dayView: CalendarView = CalendarView.Day;

  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  userId = this.decodedToken.id;

  newEntry: TimeEntry = {
    userId: this.userId,
    date: '',
    hours: '0',
    description: '',
    type: 'event',
  };
  date = '';
  time = '';

  constructor(
    private timeEntryService: TimeEntryService,
    private googleAuthService: GoogleAuthService // Inject GoogleAuthService
  ) {}

  ngOnInit(): void {
    this.loadTimeEntries();
  }

  loadTimeEntries(): void {
    const startDate = this.getStartOfMonth();
    const endDate = this.getEndOfMonth();

    this.timeEntryService
      .getTimeEntries(this.userId, startDate, endDate)
      .pipe(
        catchError((error: any) => {
          console.error('Error loading time entries:', error);
          return of([] as TimeEntry[]);
        })
      )
      .subscribe((entries) => {
        this.events = entries.map((entry) => {
          const startDate = new Date(entry.date);
          const endDate = addHours(startDate, Number(entry.hours));
          return {
            start: startDate,
            end: endDate,
            title: `${entry.description}`,
          };
        });
      });
  }

  getStartOfMonth(): string {
    const now = new Date();
    const monthValue = now.getMonth() + 1;
    const month = `${monthValue}`.padStart(2, '0');
    return `${now.getFullYear()}-${month}-01`;
  }

  getEndOfMonth(): string {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthValue = now.getMonth() + 1;
    const month = `${monthValue}`.padStart(2, '0');
    return `${now.getFullYear()}-${month}-${lastDay.getDate()}`;
  }

  async createEntry(): Promise<void> {
    try {
      // Google Calendar integration
      await this.googleAuthService.signIn();
      const token = this.googleAuthService.getAuthToken();
      if (!token) throw new Error('Google authentication failed');

      const event = {
        summary: this.newEntry.description,
        start: {
          dateTime: new Date(`${this.date}T${this.time}:00Z`).toISOString(), // Use UTC
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(`${this.date}T${this.time}:00Z`).toISOString(), // Use UTC
          timeZone: 'UTC',
        },
      };

      await this.addGoogleCalendarEvent(token, event);

      // Existing logic to create time entry
      this.newEntry.date = `${this.date}T${this.time}:00.000+02:00`;
      await this.timeEntryService.createTimeEntry(this.newEntry).toPromise();
      this.loadTimeEntries();
      this.newEntry = {
        userId: this.userId,
        date: '',
        hours: '0',
        description: '',
        type: 'event',
      };
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create event. Please try again.');
    }
  }

  private async addGoogleCalendarEvent(token: string, event: any): Promise<void> {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message || 'Failed to create Google Calendar event');
      }

      console.log('Event added successfully');
    } catch (error) {
      console.error('Error adding Google Calendar event:', error);
      alert('Failed to add Google Calendar event. Please try again.');
    }
  }

  dayClicked({ date }: { date: Date }): void {
    this.view = CalendarView.Day;
    this.viewDate = date;
  }

  onViewChange(view: CalendarView) {
    this.view = view;
  }
}
