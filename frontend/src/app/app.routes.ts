import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AdminApprovalComponent } from './components/admin-approval/admin-approval.component';
import { UserOverviewComponent } from './components/user-overview/user-overview.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
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
