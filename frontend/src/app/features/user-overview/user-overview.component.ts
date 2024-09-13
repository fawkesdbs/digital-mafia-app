import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { SidebarService } from '../../services/sidebar.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-overview',
  standalone: true,
  imports: [CommonModule, CapitalizePipe],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css',
})
export class UserOverviewComponent implements OnInit {
  users: any[] = [];
  isSidebarExpanded: boolean = false;

  constructor(
    private userService: UserService,
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Subscribe to sidebar expansion changes
    this.sidebarService.isSidebarExpanded$.subscribe((expanded) => {
      this.isSidebarExpanded = expanded;
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log('Users data:', data); // Debug log
        this.users = data; // Ensure this matches the API response format
      },
      (error) => {
        console.error('Error fetching users:', error); // Error log
      }
    );
  }

  viewUserProfile(userId: number) {
    this.router.navigate(['/profile', userId]);
  }
}
