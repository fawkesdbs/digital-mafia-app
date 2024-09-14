// sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import { MessageInputComponent } from '../chat/message-input/message-input.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, MessageInputComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  currentUserId = this.decodedToken.id;

  isSidebarExpanded = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  goToProfile() {
    if (this.currentUserId !== null) {
      this.router.navigate(['/profile', this.currentUserId]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openChatRoom(): void {
    // Pass a default or test userId, or adapt as needed
    const testUserId = 1; // Replace with actual userId if required
    this.router.navigate(['/chat-room', testUserId]);
  }
}
