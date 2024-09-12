import { Component } from '@angular/core';
import { CalendarWidgetComponent } from '../../components/calendar-widget/calendar-widget.component';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CalendarWidgetComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {}
