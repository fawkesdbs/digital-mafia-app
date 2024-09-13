import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TimeEntryService, TimeEntry } from '../../services/time-entry.service';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import { InputComponent } from '../../components/input/input.component';
import { SidebarService } from '../../services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-time-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './time-tracker.component.html',
  styleUrl: './time-tracker.component.css',
})
export class TimeTrackerComponent implements OnInit {
  timeEntries: any[] = [];
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

    // Subscribe to sidebar expansion changes
    this.sidebarService.isSidebarExpanded$.subscribe((expanded) => {
      this.isSidebarExpanded = expanded;
    });
  }

  loadTimeEntries(): void {
    this.timeEntryService
      .getTimeEntries(this.userId, this.startDate, this.endDate)
      .pipe(
        catchError((error) => {
          console.error('Error loading time entries:', error);
          return of([]);
        })
      )
      .subscribe((entries) => {
        this.timeEntries = entries
          .map((entry) => ({
            ...entry,
            isEditing: false, // Add an `isEditing` flag to each entry
          }))
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      });
  }

  toggleEditEntry(entry: any): void {
    entry.isEditing = !entry.isEditing; // Toggle edit mode
  }

  applyCustomRange() {
    this.loadTimeEntries();
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

  updateEntry(entry: any): void {
    this.timeEntryService
      .updateTimeEntry(entry.id, entry)
      .pipe(
        catchError((error) => {
          console.error('Error updating entry:', error);
          const errorMessage =
            error.error || 'Failed to update log entry. Please try again.';
          alert(errorMessage);
          return of(null); // Return null if there's an error
        })
      )
      .subscribe(() => {
        entry.isEditing = false;
        this.loadTimeEntries();
      });
  }

  deleteEntry(entry: any): void {
    this.timeEntryService
      .deleteTimeEntry(entry.id)
      .pipe(
        catchError((error) => {
          console.error('Error deleting entry:', error);
          const errorMessage =
            error.error || 'Failed to delete log entry. Please try again.';
          alert(errorMessage);
          return of(null); // Return null if there's an error
        })
      )
      .subscribe(() => {
        this.loadTimeEntries();
      });
  }
}
