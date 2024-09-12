import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-approval.component.html',
  styleUrls: ['./admin-approval.component.css'],
})
export class AdminApprovalComponent implements OnInit {
  pendingAdmins: any[] = [];
  isSidebarExpanded: boolean = false;

  constructor(
    private userService: UserService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.loadPendingAdmins();

    // Subscribe to sidebar expansion changes
    this.sidebarService.isSidebarExpanded$.subscribe((expanded) => {
      this.isSidebarExpanded = expanded;
    });
  }

  private loadPendingAdmins(): void {
    this.userService.getPendingAdmins().subscribe(
      (data) => {
        console.log('Pending admins data:', data); // Debug log
        this.pendingAdmins = data; // Ensure this matches the API response format
      },
      (error) => {
        console.error('Error fetching pending admins:', error); // Error log
      }
    );
  }

  approveAdmin(adminId: number): void {
    this.userService.approveAdmin(adminId).subscribe(() => {
      this.pendingAdmins = this.pendingAdmins.filter(
        (admin) => admin.id !== adminId
      );
    });
    this.loadPendingAdmins();
  }

  rejectAdmin(adminId: number): void {
    this.userService.rejectAdmin(adminId).subscribe(() => {
      this.pendingAdmins = this.pendingAdmins.filter(
        (admin) => admin.id !== adminId
      );
    });
    this.loadPendingAdmins();
  }
}
