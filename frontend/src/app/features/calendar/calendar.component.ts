import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CalendarWidgetComponent } from '../../components/calendar-widget/calendar-widget.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import { TimeEntry, TimeEntryService } from '../../services/time-entry.service';
import { InputComponent } from '../../components/input/input.component';
import { addHours } from 'date-fns';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [FormsModule, CalendarWidgetComponent, InputComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
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
    let month: string;
    if (`${monthValue}`.length === 1) {
      month = '0' + `${monthValue}`;
    } else {
      month = `${monthValue}`;
    }
    return `${now.getFullYear()}-${month}-01`;
  }

  getEndOfMonth(): string {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const monthValue = now.getMonth() + 1;
    let month: string;
    if (`${monthValue}`.length === 1) {
      month = '0' + `${monthValue}`;
    } else {
      month = `${monthValue}`;
    }
    return `${now.getFullYear()}-${month}-${lastDay.getDate()}`;
  }

  createEntry(): void {
    this.newEntry.date = `${this.date}T${this.time}:00.000+02:00`;
    this.timeEntryService
      .createTimeEntry(this.newEntry)
      .pipe(
        catchError((error) => {
          console.error('Error creating entry:', error);
          const errorMessage =
            error.error || 'Failed to create log entry. Please try again.';
          alert(errorMessage);
          return of(null); // Return null or some default value
        })
      )
      .subscribe(() => {
        this.loadTimeEntries();
        this.newEntry = {
          userId: this.userId,
          date: '',
          hours: '',
          description: '',
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
