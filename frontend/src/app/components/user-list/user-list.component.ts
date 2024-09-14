import { UserService } from './../../services/user.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  @Output() userSelected = new EventEmitter<any>();
  users: any[] = [];
  filteredUsers: any[] = [];

  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  userId: string = this.decodedToken.id;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log('Users data:', data); // Debug log
        this.users = data; // Ensure this matches the API response format
        this.filteredUsers = this.users.filter(
          (user) => user.id !== this.userId
        );
      },
      (error) => {
        console.error('Error fetching users:', error); // Error log
      }
    );
  }

  selectUser(user: any): void {
    this.userSelected.emit(user);
  }
}
