import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegistrationComponent,
    WelcomePageComponent,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'digital-mafia';
}
