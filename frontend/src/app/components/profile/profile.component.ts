import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = {
    name: '',
    surname: '',
    phonenumber: '',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = this.authService.getUserId();
    this.http.get(`/api/users/${userId}`).subscribe(
      (response: any) => {
        this.user = response;
      },
      (error) => console.error('Error loading user data:', error)
    );
  }

  updateUser(): void {
    const userId = this.authService.getUserId();
    this.http.put(`/api/users/${userId}`, this.user).subscribe(
      () => {
        console.log('User updated successfully');
      },
      (error) => console.error('Error updating user:', error)
    );
  }
}
