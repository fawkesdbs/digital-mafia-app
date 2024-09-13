import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { format } from 'date-fns';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule, CalendarModule],
  templateUrl: './calendar-widget.component.html',
  styleUrl: './calendar-widget.component.css',
})
export class CalendarWidgetComponent {
  @Input() view: CalendarView = CalendarView.Month;
  @Input() viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];
  @Output() dayClicked = new EventEmitter<{ date: Date }>();
  @Output() viewChanged = new EventEmitter<CalendarView>();
  @Output() dateChanged = new EventEmitter<Date>();

  get formattedDate(): string {
    return this.view === CalendarView.Month
      ? format(this.viewDate, 'MMMM yyyy')
      : format(this.viewDate, 'MMMM d, yyyy');
  }

  monthView: CalendarView = CalendarView.Month;
  dayView: CalendarView = CalendarView.Day;

  isMonthView() {
    return this.view === CalendarView.Month;
  }
  isDayView() {
    return this.view === CalendarView.Day;
  }

  onDayClick(event: { date: Date }) {
    this.dayClicked.emit(event);
  }

  onViewChange(view: CalendarView) {
    this.viewChanged.emit(view);
    this.viewDate = new Date();
  }

  changeMonth(direction: number) {
    const newDate = new Date(this.viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    this.viewDate = newDate;
    this.dateChanged.emit(newDate);
  }

  changeDay(direction: number) {
    const newDate = new Date(this.viewDate);
    newDate.setDate(newDate.getDate() + direction);
    this.viewDate = newDate;
    this.dateChanged.emit(newDate);
  }
}
