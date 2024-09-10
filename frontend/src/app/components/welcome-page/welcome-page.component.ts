import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {

}
