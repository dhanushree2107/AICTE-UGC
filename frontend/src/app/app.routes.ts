import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Portals
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'process',
    loadComponent: () => import('./features/public/process/process.component').then(m => m.ProcessComponent)
  },
  {
    path: 'eligibility',
    loadComponent: () => import('./features/public/eligibility/eligibility.component').then(m => m.EligibilityComponent)
  },
  {
    path: 'dates',
    loadComponent: () => import('./features/public/dates/dates.component').then(m => m.DatesComponent)
  },
  {
    path: 'notices',
    loadComponent: () => import('./features/public/notices/notices.component').then(m => m.NoticesComponent)
  },
  {
    path: 'faqs',
    loadComponent: () => import('./features/public/faqs/faqs.component').then(m => m.FaqsComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/public/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'track',
    loadComponent: () => import('./features/public/track/track.component').then(m => m.TrackComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/public/login/login.component').then(m => m.LoginComponent)
  },

  // Secure Portals
  {
    path: 'dashboard',
    loadComponent: () => import('./features/secure/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./features/secure/account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard]
  },
  {
    path: 'institute-mgmt',
    loadComponent: () => import('./features/secure/institute-mgmt/institute-mgmt.component').then(m => m.InstituteMgmtComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_COLLEGE_ADMIN'] }
  },
  {
    path: 'applications',
    loadComponent: () => import('./features/secure/applications/applications.component').then(m => m.ApplicationsComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_COLLEGE_ADMIN'] }
  },
  {
    path: 'applications-review',
    loadComponent: () => import('./features/secure/applications-review/applications-review.component').then(m => m.ApplicationsReviewComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REVIEWER', 'ROLE_REGIONAL_OFFICER'] }
  },
  {
    path: 'inspections',
    loadComponent: () => import('./features/secure/inspections/inspections.component').then(m => m.InspectionsComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_INSPECTION_COMMITTEE', 'ROLE_REGIONAL_OFFICER'] }
  },
  {
    path: 'notifications-center',
    loadComponent: () => import('./features/secure/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
