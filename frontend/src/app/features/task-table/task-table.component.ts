import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { CeilPipe } from '../../pipes/ceil.pipe';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { InputComponent } from '../../components/input/input.component';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule, CeilPipe, TaskFormComponent, InputComponent],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.css',
})
export class TaskTableComponent implements OnInit {
  @ViewChild('taskForm') taskForm!: TaskFormComponent;
  tasks: any[] = []; // All tasks fetched from the backend
  paginatedTasks: any[] = []; // Tasks to display after pagination
  filteredTasks: any[] = []; // Tasks to display after filtering
  totalTasks = 0;
  currentPage = 1;
  pageSize = 10;
  search = '';
  priority = '';
  userRole = '';
  isModalVisible = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit() {
    if (!this.taskForm) {
      console.error('TaskFormComponent is not initialized');
    }
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (data) => {
        this.tasks = data.tasks; // Store all tasks
        this.filterTasks(); // Apply initial filtering and pagination
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  filterTasks(): void {
    // Apply search, priority, and userRole filters
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch = this.search
        ? task.title.toLowerCase().includes(this.search.toLowerCase())
        : true;
      const matchesPriority = this.priority
        ? task.priority === this.priority
        : true;
      const matchesUserRole = this.userRole
        ? task.userRole === this.userRole
        : true;

      return matchesSearch && matchesPriority && matchesUserRole;
    });

    this.totalTasks = this.filteredTasks.length; // Update total tasks count after filtering
    this.currentPage = 1; // Reset to the first page
    this.updatePaginatedTasks(); // Update pagination after filtering
  }

  updatePaginatedTasks(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(startIndex, endIndex); // Use filteredTasks for pagination
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.search = inputElement.value;
    this.filterTasks(); // Apply filtering when search changes
  }

  onPriorityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.priority = selectElement.value;
    this.filterTasks(); // Apply filtering when priority changes
  }

  onUserRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.userRole = selectElement.value;
    this.filterTasks(); // Apply filtering when user role changes
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedTasks(); // Update paginated tasks when page changes
  }

  openTaskForm(): void {
    this.isModalVisible = true;
    this.taskForm.open();
  }

  handleFormSubmit(task: any): void {
    this.taskService.createTask(task).subscribe((newTask: any) => {
      this.tasks.push(newTask);
      this.filterTasks(); // Apply filtering after adding a new task
      this.isModalVisible = false;
    });
  }
}
