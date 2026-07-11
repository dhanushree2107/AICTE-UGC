import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <div [attr.data-theme]="theme" class="app-container">
      <!-- Premium Navigation Header -->
      <header class="app-header">
        <div class="logo-section" routerLink="/" style="cursor: pointer;">
          <img src="assets/logo.png" alt="AICTE Logo" class="brand-logo-img" />
          <div>
            <h1 class="portal-title">AICTE</h1>
            <p class="portal-subtitle">UG Approval Management System</p>
          </div>
        </div>

        <nav class="public-nav" *ngIf="!isSecurePortal">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/process" routerLinkActive="active">Process</a>
          <a routerLink="/eligibility" routerLinkActive="active">Eligibility</a>
          <a routerLink="/dates" routerLinkActive="active">Dates</a>
          <a routerLink="/notices" routerLinkActive="active">Circulars</a>
          <a routerLink="/faqs" routerLinkActive="active">FAQs</a>
          <a routerLink="/search" routerLinkActive="active">Search Approved</a>
          <a routerLink="/track" routerLinkActive="active">Track Status</a>
        </nav>

        <div class="header-actions">
          <button mat-icon-button (click)="toggleTheme()" title="Toggle Dark/Light Mode">
            <mat-icon>{{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <!-- Login/Profile Menu -->
          <ng-container *ngIf="!authService.isLoggedIn(); else userProfile">
            <button mat-flat-button color="primary" class="login-btn" routerLink="/login">
              <mat-icon>login</mat-icon> Portal Login
            </button>
          </ng-container>

          <ng-template #userProfile>
            <div class="user-info-chip" [matMenuTriggerFor]="profileMenu">
              <div class="avatar-initial">{{ authService.getUserName().substring(0,2).toUpperCase() }}</div>
              <span class="user-role">{{ authService.getRoleName() }}</span>
            </div>
            <mat-menu #profileMenu="matMenu">
              <button mat-menu-item routerLink="/dashboard"><mat-icon>dashboard</mat-icon> Secure Dashboard</button>
              <button mat-menu-item routerLink="/account"><mat-icon>manage_accounts</mat-icon> My Account</button>
              <button mat-menu-item (click)="logout()"><mat-icon>logout</mat-icon> Logout</button>
            </mat-menu>
          </ng-template>
        </div>
      </header>

      <div class="layout-container">
        <!-- Secure Portal Sidebar -->
        <aside class="sidebar" *ngIf="isSecurePortal && authService.isLoggedIn()">
          <div class="sidebar-header">
            <span class="material-icons">admin_panel_settings</span>
            <h3>Secure Console</h3>
          </div>
          <nav class="sidebar-nav">
            <a routerLink="/dashboard" routerLinkActive="active"><mat-icon>analytics</mat-icon> Dashboard</a>
            <a routerLink="/account" routerLinkActive="active"><mat-icon>manage_accounts</mat-icon> My Account</a>
            <a routerLink="/institute-mgmt" *ngIf="authService.hasRole('ROLE_COLLEGE_ADMIN')"><mat-icon>business</mat-icon> My Institute</a>
            <a routerLink="/applications" *ngIf="authService.hasRole('ROLE_COLLEGE_ADMIN')"><mat-icon>assignment</mat-icon> My Applications</a>
            
            <!-- Admin / Reviewer Links -->
            <a routerLink="/applications-review" *ngIf="authService.hasAnyRole(['ROLE_SUPER_ADMIN','ROLE_AICTE_ADMIN','ROLE_REVIEWER'])"><mat-icon>fact_check</mat-icon> Review Applications</a>
            <a routerLink="/inspections" *ngIf="authService.hasAnyRole(['ROLE_SUPER_ADMIN','ROLE_AICTE_ADMIN','ROLE_INSPECTION_COMMITTEE'])"><mat-icon>event</mat-icon> Inspections</a>
            
            <a routerLink="/notifications-center"><mat-icon>notifications</mat-icon> Notifications</a>
          </nav>
        </aside>

        <!-- Dynamic Main Routing Area -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Government-style Footer -->
      <footer class="app-footer-bar">
        <div class="footer-col">
          <p>© 2026 All India Council for Technical Education (AICTE). All Rights Reserved.</p>
          <span>Developed using Advanced AI Agent technology.</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 28px;
      background-color: var(--card-bg);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-logo-img {
      width: 42px;
      height: 42px;
      object-fit: contain;
      border-radius: 8px;
      background: white;
      padding: 2px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .portal-title {
      font-size: 20px;
      margin: 0;
      font-family: var(--font-heading);
      letter-spacing: 0.5px;
      color: var(--text-color);
    }
    .portal-subtitle {
      font-size: 11px;
      margin: 0;
      color: var(--text-muted);
    }
    .public-nav {
      display: flex;
      gap: 20px;
    }
    .public-nav a {
      text-decoration: none;
      color: var(--text-color);
      font-weight: 500;
      font-size: 14px;
      padding: 6px 12px;
      border-radius: 6px;
      transition: background-color 0.2s, color 0.2s;
    }
    .public-nav a:hover, .public-nav a.active {
      background-color: var(--border-color);
      color: var(--primary-color);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .login-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;
    }
    .user-info-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 20px;
      background-color: var(--border-color);
      cursor: pointer;
    }
    .avatar-initial {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }
    .user-role {
      font-size: 12px;
      font-weight: 600;
    }
    /* Sidebar Styles */
    .sidebar {
      width: 240px;
      background-color: var(--card-bg);
      border-right: 1px solid var(--border-color);
      padding: 20px 0;
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px 15px 20px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 15px;
      color: var(--primary-color);
    }
    .sidebar-header h3 {
      margin: 0;
      font-size: 16px;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 10px;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      text-decoration: none;
      color: var(--text-color);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .sidebar-nav a:hover, .sidebar-nav a.active {
      background-color: var(--border-color);
      color: var(--primary-color);
    }
    /* Footer styles */
    .app-footer-bar {
      margin-top: auto;
      padding: 20px 28px;
      background-color: var(--card-bg);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: var(--text-muted);
    }
    .footer-col {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .footer-col p {
      margin: 0;
    }
  `]
})
export class AppComponent implements OnInit {
  theme = 'light';
  isSecurePortal = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Detect portal section based on active route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Secure portal endpoints
        const secureRoutes = ['/dashboard', '/institute-mgmt', '/applications', '/applications-review', '/inspections', '/notifications-center'];
        this.isSecurePortal = secureRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      }
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }

  loginAs(role: string) {
    this.authService.login(role);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
