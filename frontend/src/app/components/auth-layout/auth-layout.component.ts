import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, WelcomePageComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
