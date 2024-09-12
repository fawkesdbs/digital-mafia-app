import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import * as jwt_decode from 'jwt-decode';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
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

interface UpdatedUserProfile extends UserProfile {
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, InputComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
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

  updatedUser: UpdatedUserProfile = {
    ...this.user,
    currentPassword: '',
    newPassword: '',
  };
  confirmPassword: string = '';

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
          this.updatedUser = {
            ...this.user,
            currentPassword: '',
            newPassword: '',
          };
        }
      });
  }
  onSubmit() {
    const updatedUserData: any = {
      name: this.updatedUser.name,
      surname: this.updatedUser.surname,
      email: this.updatedUser.email,
      phoneNumber: this.updatedUser.phoneNumber,
      birthDate: this.updatedUser.birthDate,
      role: this.updatedUser.role,
    };

    // Only add password fields if they are provided and match
    if (this.updatedUser.newPassword && this.confirmPassword) {
      if (this.updatedUser.newPassword === this.confirmPassword) {
        updatedUserData.currentPassword = this.updatedUser.currentPassword;
        updatedUserData.newPassword = this.updatedUser.newPassword;
      } else {
        alert('New password and confirm password do not match!');
        return;
      }
    }

    this.userService.updateUserProfile(this.userId, updatedUserData).subscribe(
      (response) => {
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
        alert('Profile update failed.');
      }
    );
  }
}
