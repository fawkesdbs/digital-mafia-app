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
    type: 'event', // Default to 'event'
  };
  date = '';
  time = '';

  constructor(private timeEntryService: TimeEntryService) {}

  ngOnInit(): void {
    this.loadTimeEntries();
  }

  loadTimeEntries(): void {
    const startDate = this.getStartOfMonth();
    const endDate = this.getEndOfMonth();

    this.timeEntryService
      .getTimeEntries(this.userId, startDate, endDate)
      .pipe(
        catchError((error) => {
          console.error('Error loading time entries:', error);
          return of([] as TimeEntry[]); // Return an empty array of TimeEntry
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

  createEntry(): void {
    this.newEntry.date = `${this.date}T${this.time}:00.000+02:00`;
      // No future date validation needed for events
      this.timeEntryService
        .createTimeEntry(this.newEntry)
        .pipe(
          catchError((error) => {
            console.error('Error creating entry:', error);
            const errorMessage =
              error.error || 'Failed to create event. Please try again.';
            alert(errorMessage);
            return of(null);
          })
        )
        .subscribe(() => {
          this.loadTimeEntries();
          this.newEntry = {
            userId: this.userId,
            date: '',
            hours: '0',
            description: '',
            type: 'event', // Reset type to 'event'
          };
        });
    }
  
    dayClicked({ date }: { date: Date }): void {
      this.view = CalendarView.Day;
      this.viewDate = date;
    }
  
    onViewChange(view: CalendarView) {
      this.view = view;
    }
  }
  