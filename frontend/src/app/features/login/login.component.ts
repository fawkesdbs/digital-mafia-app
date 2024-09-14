import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { CustomJwtPayload } from '../../interfaces/jwt.interfaces';
import { GoogleAuthService } from '../../services/google-auth.service'; // Import GoogleAuthService

declare var gapi: any; // Declare gapi

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private googleAuthService: GoogleAuthService // Inject GoogleAuthService
  ) {}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  async onSubmit() {
    await this.userService
      .login(this.credentials)
      .pipe(
        catchError((error: any) => {
          console.error('Error during login:', error);
          alert('Login failed. Please try again.');
          return of(null);
        })
      )
      .subscribe(async (response) => {
        if (response?.success) {
          localStorage.setItem('authToken', response.token);
          const decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(
            response.token
          );
          const userId = decodedToken.id;
          await this.userService
            .getUserRole(userId)
            .pipe(
              catchError((error: any) => {
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

  initializeGoogleSignIn(): void {
    // Load Google API
    gapi.load('auth2', () => {
      const auth2 = gapi.auth2.init({
        client_id: '614257370060-4nk9tssa768onb8u28ccen9ri26borou.apps.googleusercontent.com', // Replace with your Google OAuth 2.0 Client ID
        scope: 'profile email',
      });

      // Attach the click handler to the button
      auth2.attachClickHandler(
        document.getElementById('googleSignInBtn')!,
        {},
        (googleUser: any) => { // Handle the sign-in token
          const idToken = googleUser.getAuthResponse().id_token;
          this.handleGoogleSignIn(idToken);
        },
        (error: any) => {
          console.error('Google Sign-In error:', error);
        }
      );
    });
  }

  handleGoogleSignIn(idToken: string): void {
    this.userService.verifyGoogleToken(idToken).subscribe({
      next: (response: any) => {
        localStorage.setItem('authToken', response.token);
        const decodedToken: CustomJwtPayload = jwt_decode.jwtDecode(response.token);
        const userId = decodedToken.id;
        this.userService.getUserRole(userId).subscribe({
          next: (userProfile: any) => {
            localStorage.setItem('userRole', userProfile.role);
            this.router.navigate(['/dashboard']);
          },
          error: (error: any) => {
            console.error('Error fetching user profile:', error);
            alert('Failed to fetch user profile.');
          }
        });
      },
      error: (error: any) => {
        console.error('Error verifying Google token:', error);
        alert('Google sign-in failed. Please try again.');
      }
    });
  }
}
