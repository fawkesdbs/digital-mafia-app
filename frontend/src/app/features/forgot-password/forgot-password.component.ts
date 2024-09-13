import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  userEmail: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isFirstStep: boolean = true;
  isSecondStep: boolean = false;
  isLastStep: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.isFirstStep = true;
  }

  onSubmitEmail() {
    this.authService
      .sendPasswordResetEmail(this.userEmail)
      .pipe(
        catchError((error) => {
          console.error('Error sending password reset email:', error);
          alert('Failed to send password reset email. Please try again.');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert(response);
          this.isFirstStep = false;
          this.isSecondStep = true;
        }
      });
  }

  onSubmitOTP() {
    this.authService
      .verifyOTP(this.userEmail, this.otp)
      .pipe(
        catchError((error) => {
          console.error('Error verifying OTP:', error);
          alert('Failed to verify OTP. Please try again.');
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          alert(response);
          this.isSecondStep = false;
          this.isLastStep = true;
        }
      });
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    this.authService
      .resetPassword(this.userEmail, this.otp, this.newPassword)
      .pipe(
        catchError((error) => {
          console.error('Error during password reset:', error);
          alert('Failed to reset password. Please try again.');
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
