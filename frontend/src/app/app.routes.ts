import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { TimeTrackerComponent } from './features/time-tracker/time-tracker.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { AdminApprovalComponent } from './features/admin-approval/admin-approval.component';
import { UserOverviewComponent } from './features/user-overview/user-overview.component';
import { TaskTableComponent } from './features/task-table/task-table.component';

export const routes: Routes = [
  { path: 'page-not-found', component: PageNotFoundComponent },
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
