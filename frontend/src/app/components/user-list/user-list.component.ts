import { UserService } from './../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { io } from 'socket.io-client';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
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

  selectUser(user: any): void {
    this.userSelected.emit(user);
  }
}
