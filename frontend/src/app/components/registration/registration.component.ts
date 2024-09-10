import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, RouterModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
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

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.http
      .post(this.apiUrl, this.user, { responseType: 'text' })
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
