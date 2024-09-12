import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './calendar-widget.component.html',
  styleUrl: './calendar-widget.component.css',
})
export class CalendarWidgetComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: new Date(),
      title: 'Sample Event',
    },
  ];

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date }: { date: Date }) {
    console.log(date);
  }
}
