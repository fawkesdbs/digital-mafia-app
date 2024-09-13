import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import * as XLSX from 'xlsx';
import { InputComponent } from '../../components/input/input.component';
import { SidebarService } from '../../services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

interface TimeEntryWithEditing extends TimeEntry {
  isEditing?: boolean;
}

@Component({
  selector: 'app-time-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.css'],
})
export class TimeTrackerComponent implements OnInit {
  timeEntries: TimeEntryWithEditing[] = [];
  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  userId = this.decodedToken.id;
  startDate = '2024-09-01';
  endDate = '2024-09-30';
  newEntry: TimeEntry = {
    userId: this.userId,
    date: '',
    hours: '0',
    description: '',
    type: 'log',
  };
  isSidebarExpanded: boolean = false;
  date = '';
  time = '';

  constructor(
    private timeEntryService: TimeEntryService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.loadTimeEntries();
    this.sidebarService.isSidebarExpanded$.subscribe((expanded) => {
      this.isSidebarExpanded = expanded;
    });
  }

  fileName = 'LogSheet.xlsx';

  exportExcel() {
    let data = document.getElementById('log-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);

    XLSX.writeFile(wb, this.fileName);
  }

  private isValidTimeEntry(date: string, type: string): boolean {
    const entryDate = new Date(date);
    const currentDate = new Date();
    return type === 'event' || entryDate <= currentDate;
  }

  loadTimeEntries(): void {
    this.timeEntryService
      .getTimeEntries(this.userId, this.startDate, this.endDate)
      .pipe(
        catchError((error) => {
          console.error('Error loading time entries:', error);
          return of([] as TimeEntryWithEditing[]);
        })
      )
      .subscribe((entries) => {
        this.timeEntries = entries
          .map((entry) => ({
            ...entry,
            isEditing: false,
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      });
  }

  toggleEditEntry(entry: TimeEntryWithEditing): void {
    entry.isEditing = !entry.isEditing;
  }

  applyCustomRange() {
    this.loadTimeEntries();
  }

  createEntry(): void {
    const entryDate = `${this.date}T${this.time}:00.000+02:00`;
    if (
      this.newEntry.type === 'log' &&
      !this.isValidTimeEntry(entryDate, 'log')
    ) {
      alert('Cannot create time entry for the future.');
      return;
    }

    this.newEntry.date = entryDate;
    this.timeEntryService
      .createTimeEntry(this.newEntry)
      .pipe(
        catchError((error) => {
          console.error('Error creating entry:', error);
          const errorMessage =
            error.error || 'Failed to create log entry. Please try again.';
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
          type: 'log',
        };
      });
  }

  updateEntry(entry: TimeEntryWithEditing): void {
    if (entry.type === 'log' && !this.isValidTimeEntry(entry.date, 'log')) {
      alert('Cannot update time entry for the future.');
      return;
    }

    this.timeEntryService
      .updateTimeEntry(entry.id as string, entry)
      .pipe(
        catchError((error) => {
          console.error('Error updating entry:', error);
          const errorMessage =
            error.error || 'Failed to update log entry. Please try again.';
          alert(errorMessage);
          return of(null);
        })
      )
      .subscribe(() => {
        entry.isEditing = false;
        this.loadTimeEntries();
      });
  }

  deleteEntry(entry: TimeEntryWithEditing): void {
    if (entry.type === 'log' && !this.isValidTimeEntry(entry.date, 'log')) {
      alert('Cannot delete time entry for the future.');
      return;
    }

    this.timeEntryService
      .deleteTimeEntry(entry.id as string)
      .pipe(
        catchError((error) => {
          console.error('Error deleting entry:', error);
          const errorMessage =
            error.error || 'Failed to delete log entry. Please try again.';
          alert(errorMessage);
          return of(null);
        })
      )
      .subscribe(() => {
        this.loadTimeEntries();
      });
  }
}
