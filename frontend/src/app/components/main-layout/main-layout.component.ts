import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';
import { UserService } from '../../services/user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminApprovalComponent } from '../admin-approval/admin-approval.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    WelcomePageComponent,
    RouterOutlet,
    SidebarComponent,
    AdminApprovalComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  isSidebarExpanded = false;
  isAdmin: boolean = false;

  constructor(public router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.checkIfAdmin();
  }

  private checkIfAdmin(): void {
    const role = localStorage.getItem('userRole');

    if (role) {
      this.isAdmin = role === 'admin';
    }
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
