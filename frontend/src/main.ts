import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MainLayoutComponent } from './app/components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './app/components/auth-layout/auth-layout.component';
import { RegistrationComponent } from './app/components/registration/registration.component';
import { LoginComponent } from './app/components/login/login.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { ProfileComponent } from './app/components/profile/profile.component';
import { CalendarComponent } from './app/components/calendar/calendar.component';
import { AnalyticsComponent } from './app/components/analytics/analytics.component';
import { AdminApprovalComponent } from './app/components/admin-approval/admin-approval.component';
import { UserOverviewComponent } from './app/components/user-overview/user-overview.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthService } from './app/services/auth.service';
import { UserService } from './app/services/user.service';
import { AdminGuard } from './app/guards/admin.guard';
import { AuthGuard } from './app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'register', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'analytics', component: AnalyticsComponent },
      {
        path: 'admin-approval',
        component: AdminApprovalComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'user-overview',
        component: UserOverviewComponent,
        canActivate: [AdminGuard],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/register' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withFetch()),
    AuthService,
    UserService,
    AdminGuard,
  ],
}).catch((err) => console.error(err));
