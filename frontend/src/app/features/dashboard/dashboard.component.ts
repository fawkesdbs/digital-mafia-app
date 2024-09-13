import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { TimeEntryGraphComponent } from '../../components/time-entry-graph/time-entry-graph.component';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import * as jwt_decode from 'jwt-decode';
import { catchError, of } from 'rxjs';

interface UserProfile {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TimeEntryGraphComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  token = localStorage.getItem('authToken') || '';
  decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(this.token);
  userId = this.decodedToken.id;

  user: UserProfile = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    password: '',
    role: '',
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getUserProfile(this.userId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user profile:', error);
          const errorMessage =
            error.error || 'Failed to load user profile. Please try again.';
          alert(errorMessage);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.user = response.user;
        }
      });
  }
}
