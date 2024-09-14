import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  @Input() isVisible: boolean = false;
  task = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: '',
    userRole: '',
  };

  @Output() formSubmit = new EventEmitter<any>();

  open(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

  onSubmit(): void {
    this.formSubmit.emit(this.task);
    this.close();
  }
}
