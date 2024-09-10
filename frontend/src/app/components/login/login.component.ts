import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule], // Include FormsModule in imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
          return of(null); // Handle the error gracefully
        })
      )
      .subscribe(async (response) => {
        if (response?.success) {
          localStorage.setItem('authToken', response.token); // Store the token

          // Fetch user role and store in localStorage
          await this.userService
            .getUserProfile()
            .pipe(
              catchError((error) => {
                console.error('Error fetching user profile:', error);
                alert('Failed to fetch user profile.');
                return of({ role: 'guest' }); // Provide a default value or handle gracefully
              })
            )
            .subscribe((userProfile) => {
              console.log(userProfile);

              localStorage.setItem('userRole', userProfile.role);
              this.router.navigate(['/dashboard']);
            });
        } else {
          alert(response.message);
        }
      });
  }
}
