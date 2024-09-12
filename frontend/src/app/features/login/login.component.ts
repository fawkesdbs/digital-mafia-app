import { Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService
      .login(this.credentials)
      .pipe(
        catchError((error) => {
          console.error('Error during login:', error);
          alert('Login failed. Please try again.');
          return of(null);
        })
      )
      .subscribe(async (response) => {
        if (response?.success) {
          localStorage.setItem('authToken', response.token);

          await this.userService
            .getUserProfile()
            .pipe(
              catchError((error) => {
                console.error('Error fetching user profile:', error);
                alert('Failed to fetch user profile.');
                return of({ role: 'guest' });
              })
            )
            .subscribe((userProfile) => {
              localStorage.setItem('userRole', userProfile.role);
              this.router.navigate(['/dashboard']);
            });
        } else {
          alert(response.message);
        }
      });
  }
}
