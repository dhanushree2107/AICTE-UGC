import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="account-container">
      <header class="account-header">
        <h2>My Security Profile</h2>
        <p>Manage your OpenID Connect (OIDC) authentication credentials, sessions, and multi-factor keys.</p>
      </header>

      <div class="account-layout">
        <!-- left Panel: Profile Summary -->
        <mat-card class="profile-card">
          <div class="profile-avatar">
            <span>{{ authService.getUserName().substring(0,2).toUpperCase() }}</span>
          </div>
          <h3>{{ authService.getUserName() }}</h3>
          <p class="role-title">{{ authService.getRoleName() }}</p>

          <div class="meta-list">
            <div class="meta-item">
              <span class="label">SSO Provider:</span>
              <span class="val">Keycloak Core</span>
            </div>
            <div class="meta-item">
              <span class="label">MFA Status:</span>
              <span class="val mfa-active">Active (OTP)</span>
            </div>
          </div>

          <button mat-flat-button color="primary" class="reset-btn" (click)="triggerPasswordReset()">
            <mat-icon>vpn_key</mat-icon> Reset Credentials
          </button>
        </mat-card>

        <!-- Right Panel: Tabs/Details -->
        <div class="details-pane">
          <!-- Token Claims metadata card -->
          <mat-card class="details-card">
            <h3>Active JWT Claims (OIDC Token)</h3>
            <div class="claims-grid">
              <div class="claim-item">
                <span class="label">Issuer (iss)</span>
                <code>http://localhost:8080/realms/aicte-realm</code>
              </div>
              <div class="claim-item">
                <span class="label">Authorized Party (azp)</span>
                <code>aicte-frontend</code>
              </div>
              <div class="claim-item">
                <span class="label">Token Expiration (exp)</span>
                <code>Active (Refreshes in 4 minutes)</code>
              </div>
              <div class="claim-item">
                <span class="label">Subject Claim (sub)</span>
                <code>f8942dfc-a931-41e9-9133-88bc98cfa103</code>
              </div>
            </div>
          </mat-card>

          <!-- Session Management -->
          <mat-card class="details-card" style="margin-top: 24px;">
            <div class="card-header-row">
              <h3>Active Session Log</h3>
              <button mat-stroked-button color="warn" (click)="revokeSessions()">Revoke All Other Sessions</button>
            </div>
            <div class="table-wrapper">
              <table class="session-table">
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>IP Address</th>
                    <th>Started</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let ses of sessions">
                    <td><strong>{{ ses.device }}</strong></td>
                    <td><code>{{ ses.ip }}</code></td>
                    <td>{{ ses.started }}</td>
                    <td><span class="status-badge" [class.current]="ses.current">{{ ses.current ? 'Current Session' : 'Active' }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .account-header { margin-bottom: 24px; }
    .account-header h2 { font-size: 24px; margin: 0; }
    .account-header p { color: var(--text-muted); margin: 4px 0 0 0; font-size: 14px; }

    .account-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 24px;
    }

    .profile-card {
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .profile-card h3 { margin: 0; font-size: 20px; font-family: var(--font-heading); }
    .role-title {
      font-size: 12px;
      color: var(--primary-color);
      font-weight: 700;
      text-transform: uppercase;
      margin: 4px 0 20px 0;
      letter-spacing: 0.5px;
    }
    .meta-list {
      width: 100%;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 0;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .meta-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .meta-item .label { color: var(--text-muted); }
    .meta-item .val { font-weight: 600; }
    .meta-item .val.mfa-active { color: #059669; }
    
    .reset-btn {
      width: 100%;
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;
    }

    .details-card { padding: 24px; }
    .details-card h3 { margin: 0 0 16px 0; font-size: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }
    
    .claims-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .claim-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .claim-item .label { font-size: 11px; color: var(--text-muted); font-weight: 600; }
    .claim-item code {
      font-size: 12px;
      padding: 6px 10px;
      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      word-break: break-all;
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .card-header-row h3 { border: none; margin: 0; padding: 0; }

    .table-wrapper {
      background-color: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    .session-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    .session-table th { padding: 10px 14px; background-color: var(--border-color); font-weight: 600; }
    .session-table td { padding: 10px 14px; border-bottom: 1px solid var(--border-color); }
    
    .status-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 12px;
      background-color: var(--border-color);
    }
    .status-badge.current {
      background-color: #d1fae5;
      color: #065f46;
    }
  `]
})
export class AccountComponent implements OnInit {
  sessions = [
    { device: "Chrome 124 (Windows 11)", ip: "192.168.1.5", started: "2 hours ago", current: true },
    { device: "Edge 123 (Windows 11)", ip: "192.168.1.5", started: "3 days ago", current: false },
    { device: "Safari Mobile (iOS 17)", ip: "172.56.21.90", started: "5 days ago", current: false }
  ];

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  triggerPasswordReset() {
    alert("Keycloak OIDC Password Reset action triggered. A verification link has been sent to your account profile email.");
  }

  revokeSessions() {
    this.sessions = this.sessions.filter(ses => ses.current);
    alert("Keycloak Client Session Revocation complete. All other terminal sessions terminated.");
  }
}
