import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CalendarModule,
  CalendarEvent,
  CalendarUtils,
  DateAdapter,
} from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { AuthService } from '../../services/auth.service';
import { CalendarNativeDateFormatter } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule],
  providers: [CalendarUtils],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  newEventTitle: string = '';
  selectedDate: Date | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action, event);
  }

  selectDate(day: { date: Date }): void {
    this.selectedDate = startOfDay(day.date);
  }

  addEvent(): void {
    if (this.newEventTitle && this.selectedDate) {
      const newEvent: CalendarEvent = {
        start: this.selectedDate,
        title: this.newEventTitle,
      };

      this.events = [...this.events, newEvent];

      // Save events to local storage
      this.saveEventsToLocalStorage();

      this.newEventTitle = '';
      this.selectedDate = null;
    }
  }

  saveEventsToLocalStorage(): void {
    const userId = this.authService.getUserId();
    const eventsKey = `events_${userId}`;

    localStorage.setItem(eventsKey, JSON.stringify(this.events));
  }

  loadEvents(): void {
    const userId = this.authService.getUserId();
    const eventsKey = `events_${userId}`;
    const savedEvents = localStorage.getItem(eventsKey);

    if (savedEvents) {
      this.events = JSON.parse(savedEvents).map((event: any) => ({
        start: new Date(event.start),
        title: event.title,
      }));
    }
  }
}
