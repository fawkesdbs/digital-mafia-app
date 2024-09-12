import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InputComponent } from '../../components/input/input.component';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  user = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    password: '',
    role: '',
  };
  confirmPassword: string = '';
  apiUrl = 'http://localhost:3000/api/user/register';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.userService
      .register(this.user)
      .pipe(
        catchError((error) => {
          console.error('Registration error:', error);
          const errorMessage =
            error.error || 'Registration failed. Please try again.';
          alert(errorMessage);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert(response);
          this.router.navigate(['/login']);
        }
      });
  }
}
