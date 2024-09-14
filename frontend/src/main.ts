import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { AuthLayoutComponent } from './app/layout/auth-layout/auth-layout.component';
import { SignUpComponent } from './app/features/sign-up/sign-up.component';
import { LoginComponent } from './app/features/login/login.component';
import { MainLayoutComponent } from './app/layout/main-layout/main-layout.component';
import { DashboardComponent } from './app/features/dashboard/dashboard.component';
import { ProfileComponent } from './app/features/profile/profile.component';
import { CalendarComponent } from './app/features/calendar/calendar.component';
import { TimeTrackerComponent } from './app/features/time-tracker/time-tracker.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AdminGuard } from './app/guards/admin.guard';
import { AuthService } from './app/services/auth.service';
import { UserService } from './app/services/user.service';
import { PageNotFoundComponent } from './app/features/page-not-found/page-not-found.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { importProvidersFrom } from '@angular/core';
import { AdminApprovalComponent } from './app/features/admin-approval/admin-approval.component';
import { UserOverviewComponent } from './app/features/user-overview/user-overview.component';
import { ForgotPasswordComponent } from './app/features/forgot-password/forgot-password.component';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { TaskTableComponent } from './app/features/task-table/task-table.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const routes: Routes = [
  { path: 'page-not-found', component: PageNotFoundComponent },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'register', component: SignUpComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: '', redirectTo: 'register', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'time-log', component: TimeTrackerComponent },
      { path: 'tasks', component: TaskTableComponent },
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
  { path: '**', redirectTo: '/page-not-found' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      FormsModule  // Include FormsModule here
    ),
    provideHttpClient(),
    provideHttpClient(withFetch()),
    provideCharts(withDefaultRegisterables()),
    AuthService,
    UserService,
    AdminGuard,
    AuthGuard, provideAnimationsAsync(),
  ],
}).catch((err) => console.error(err));
