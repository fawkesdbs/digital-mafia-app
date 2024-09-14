import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.initializeGoogleSignUp();
  }

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

  initializeGoogleSignUp(): void {
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: '614257370060-4nk9tssa768onb8u28ccen9ri26borou.apps.googleusercontent.com', // Replace with your Google OAuth 2.0 Client ID
        scope: 'profile email',
      });

      auth2.attachClickHandler(
        document.getElementById('googleSignUpBtn')!,
        {},
        (googleUser: gapi.auth2.GoogleUser) => {
          const idToken = googleUser.getAuthResponse().id_token;
          this.handleGoogleSignUp(idToken);
        },
        (error: any) => {
          console.error('Google Sign-Up error:', error);
        }
      );
    });
  }

  handleGoogleSignUp(idToken: string): void {
    this.userService.verifyGoogleToken(idToken, true).subscribe({
      next: (response: any) => {
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        if (error.error === 'popup_closed_by_user') {
          console.warn('Google Sign-Up was canceled by the user.');
          alert('Sign-Up was canceled. Please try again.');
        } else {
          console.error('Error verifying Google token:', error);
          alert('Google sign-up failed. Please try again.');
        }
      }
    });
  }
}  
