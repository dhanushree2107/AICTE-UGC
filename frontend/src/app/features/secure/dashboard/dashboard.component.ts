import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <h2>Welcome back, {{ authService.getUserName() }}!</h2>
          <p>Logged in as: <strong style="color: var(--primary-color)">{{ authService.getRoleName() }}</strong></p>
        </div>
        <div class="header-actions">
          <span class="system-time">Portal Session Active</span>
        </div>
      </header>

      <!-- Stats Summary cards -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-num">1</div>
          <div class="stat-desc">Active Applications</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">92%</div>
          <div class="stat-desc">AI Compliance Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">1:15</div>
          <div class="stat-desc">Faculty-Student Ratio</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">3</div>
          <div class="stat-desc">Verified Documents</div>
        </div>
      </div>

      <div class="grid-layout">
        <!-- AI Analytical Assessment Metrics Panel -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>AI Compliance Breakdown</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="bars-container">
              <div class="bar-item">
                <div class="bar-label">
                  <span>Faculty Adequacy</span>
                  <strong>95%</strong>
                </div>
                <div class="bar-track"><div class="bar-fill blue" style="width: 95%"></div></div>
              </div>
              <div class="bar-item">
                <div class="bar-label">
                  <span>Classroom Dimensions</span>
                  <strong>90%</strong>
                </div>
                <div class="bar-track"><div class="bar-fill green" style="width: 90%"></div></div>
              </div>
              <div class="bar-item">
                <div class="bar-label">
                  <span>Document Authenticity</span>
                  <strong>92%</strong>
                </div>
                <div class="bar-track"><div class="bar-fill purple" style="width: 92%"></div></div>
              </div>
              <div class="bar-item">
                <div class="bar-label">
                  <span>Statutory Compliance</span>
                  <strong>100%</strong>
                </div>
                <div class="bar-track"><div class="bar-fill gold" style="width: 100%"></div></div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Activities Console -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Recent Platform Activities</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div class="activity-item">
                <mat-icon class="activity-icon green">check_circle</mat-icon>
                <div>
                  <h4>Land Registration Document Verified</h4>
                  <p>OCR extracted Plot registration REG-LAND-998877. Status: Approved.</p>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon class="activity-icon blue">info</mat-icon>
                <div>
                  <h4>Application Submitted</h4>
                  <p>Reference Code 'AICTE-2026-MITP-001' generated.</p>
                </div>
              </div>
              <div class="activity-item">
                <mat-icon class="activity-icon purple">sync</mat-icon>
                <div>
                  <h4>Keycloak Profile Synchronized</h4>
                  <p>Session mapped to College Representative profile.</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dashboard-header h2 { font-size: 24px; margin: 0; }
    .dashboard-header p { margin: 4px 0 0 0; color: var(--text-muted); font-size: 14px; }
    .system-time {
      font-size: 12px;
      font-weight: 600;
      color: #059669;
      background-color: #d1fae5;
      padding: 6px 12px;
      border-radius: 20px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .stat-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow-light);
    }
    .stat-num {
      font-size: 32px;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    .stat-desc {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .chart-card, .activity-card {
      padding: 16px;
    }
    
    .bars-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .bar-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .bar-label {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .bar-track {
      height: 8px;
      background-color: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 4px;
    }
    .bar-fill.blue { background-color: #3b82f6; }
    .bar-fill.green { background-color: #10b981; }
    .bar-fill.purple { background-color: #8b5cf6; }
    .bar-fill.gold { background-color: #f59e0b; }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .activity-item {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .activity-icon {
      padding: 6px;
      border-radius: 50%;
    }
    .activity-icon.green { background-color: #d1fae5; color: #059669; }
    .activity-icon.blue { background-color: #dbeafe; color: #1e40af; }
    .activity-icon.purple { background-color: #f3e8ff; color: #6b21a8; }
    
    .activity-item h4 { margin: 0; font-size: 14px; font-weight: 600; }
    .activity-item p { margin: 2px 0 0 0; font-size: 12px; color: var(--text-muted); }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(public authService: AuthService) {}
  ngOnInit() {}
}
