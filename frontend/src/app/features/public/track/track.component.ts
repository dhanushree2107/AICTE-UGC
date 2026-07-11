import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="track-container">
      <header class="track-header">
        <h2>Track Application Status</h2>
        <p>Check approval workflow status, OCR report, and inspection timelines using your reference code.</p>
      </header>

      <!-- Search Card -->
      <div class="form-card">
        <div class="search-form">
          <div class="form-group">
            <label for="refNo">Application Reference Number</label>
            <div class="input-wrapper">
              <mat-icon class="input-icon">fingerprint</mat-icon>
              <input type="text" id="refNo" [(ngModel)]="refNo" placeholder="e.g. AICTE-2026-MITP-001" />
            </div>
          </div>
          <button mat-flat-button color="primary" class="search-btn" (click)="trackApplication()" [disabled]="loading">
            <span *ngIf="!loading">Track Status</span>
            <span *ngIf="loading" class="spinner-small"></span>
          </button>
        </div>
      </div>

      <!-- Loading Spinner View -->
      <div *ngIf="loading" class="tracking-loader">
        <div class="spinner-circle"></div>
        <p>Fetching real-time verification logs...</p>
      </div>

      <!-- Not Found Alert -->
      <div class="alert-box error" *ngIf="searched && !appData && !loading">
        <mat-icon>error_outline</mat-icon>
        <p>Reference number not found. Please verify the code (e.g. AICTE-2026-MITP-001) and try again.</p>
      </div>

      <!-- Tracking Timeline Results -->
      <div class="status-results" *ngIf="appData && !loading">
        <mat-card class="results-card">
          <mat-card-header>
            <h3 class="panel-title">Application: {{ appData.application.refNo }}</h3>
          </mat-card-header>
          <mat-card-content>
            <div class="details-grid">
              <div class="detail-item">
                <span class="label">Academic Year:</span>
                <span class="val">{{ appData.application.academicYear }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Current Status:</span>
                <span class="status-badge" [attr.data-status]="appData.application.overallStatus">{{ appData.application.overallStatus }}</span>
              </div>
            </div>

            <!-- Visual Progress Timeline -->
            <div class="timeline-visual">
              <!-- Step 1 -->
              <div class="step" [class.completed]="isStepCompleted('SUBMITTED')" [class.active]="isStepActive('SUBMITTED')">
                <div class="node">
                  <mat-icon>send</mat-icon>
                </div>
                <p>Submitted</p>
              </div>
              
              <div class="connector" [class.completed]="isStepCompleted('UNDER_OCR')" [class.active]="isStepActive('UNDER_OCR')"></div>
              
              <!-- Step 2 -->
              <div class="step" [class.completed]="isStepCompleted('UNDER_OCR')" [class.active]="isStepActive('UNDER_OCR')">
                <div class="node">
                  <mat-icon>psychology</mat-icon>
                </div>
                <p>AI OCR Audit</p>
              </div>
              
              <div class="connector" [class.completed]="isStepCompleted('INSPECTION_SCHEDULED')" [class.active]="isStepActive('INSPECTION_SCHEDULED')"></div>
              
              <!-- Step 3 -->
              <div class="step" [class.completed]="isStepCompleted('INSPECTION_SCHEDULED')" [class.active]="isStepActive('INSPECTION_SCHEDULED')">
                <div class="node">
                  <mat-icon>groups</mat-icon>
                </div>
                <p>Inspection</p>
              </div>
              
              <div class="connector" [class.completed]="isStepCompleted('APPROVED') || isStepCompleted('REJECTED')"></div>
              
              <!-- Step 4 -->
              <div class="step" [class.completed]="isStepCompleted('APPROVED') || isStepCompleted('REJECTED')" [class.failed]="appData.application.overallStatus === 'REJECTED'">
                <div class="node">
                  <mat-icon>{{ appData.application.overallStatus === 'REJECTED' ? 'cancel' : 'verified' }}</mat-icon>
                </div>
                <p>{{ appData.application.overallStatus === 'REJECTED' ? 'Rejected' : 'Board Decision' }}</p>
              </div>
            </div>

            <!-- History Logs -->
            <h3 class="section-title">Workflow Logs</h3>
            <div class="logs-list">
              <div class="log-item" *ngFor="let log of appData.history">
                <span class="log-date">{{ log.updatedAt | date:'medium' }}</span>
                <div class="log-info">
                  <strong [attr.data-status]="log.status">{{ log.status }}</strong>
                  <p>{{ log.remarks }}</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .track-container {
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: 40px;
    }
    .track-header { margin-bottom: 28px; }
    .track-header h2 { font-size: 26px; margin: 0; font-family: var(--font-heading); font-weight: 800; }
    .track-header p { color: var(--text-muted); margin: 6px 0 0 0; font-size: 14px; }

    .form-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 28px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    
    .search-form {
      display: flex;
      align-items: flex-end;
      gap: 16px;
    }
    .search-form .form-group {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .search-form label { font-size: 12px; font-weight: 600; color: var(--text-muted); }
    .input-wrapper { position: relative; }
    .input-icon { position: absolute; left: 12px; top: 11px; color: var(--text-muted); font-size: 20px; }
    .input-wrapper input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 12px 12px 42px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-color);
      outline: none;
      font-size: 13px;
      transition: border-color 0.2s;
    }
    .input-wrapper input:focus { border-color: var(--primary-color); }

    .search-btn {
      height: 45px;
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 700;
      border-radius: 8px;
      padding: 0 24px;
    }

    /* Small spinner on button */
    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s infinite linear;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Centered loading overlay */
    .tracking-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 48px;
    }
    .spinner-circle {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 1s infinite linear;
    }
    .tracking-loader p { font-size: 13px; color: var(--text-muted); margin: 0; }

    .alert-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    .alert-box.error {
      background-color: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fecaca;
      font-size: 13px;
      font-weight: 500;
    }
    .alert-box p { margin: 0; }

    /* Results layout */
    .results-card {
      padding: 28px;
      border: 1px solid var(--border-color);
      border-radius: 16px;
    }
    .panel-title { font-size: 18px; margin: 0 0 16px 0; font-family: var(--font-heading); font-weight: 700; }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    .detail-item .label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
    .detail-item .val { font-size: 14px; font-weight: 600; display: block; margin-top: 4px; }
    
    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin-top: 4px;
    }
    .status-badge[data-status="SUBMITTED"] { background-color: #dbeafe; color: #1e40af; }
    .status-badge[data-status="UNDER_OCR"] { background-color: #fef3c7; color: #d97706; }
    .status-badge[data-status="INSPECTION_SCHEDULED"] { background-color: #fae8ff; color: #86198f; }
    .status-badge[data-status="APPROVED"] { background-color: #d1fae5; color: #065f46; }
    .status-badge[data-status="REJECTED"] { background-color: #fee2e2; color: #991b1b; }

    /* Stepper visualization */
    .timeline-visual {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 48px 0;
      padding: 0 12px;
      position: relative;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    
    .node {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: var(--border-color);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--card-bg);
      transition: all 0.3s ease;
    }
    .node mat-icon { font-size: 18px; width: 18px; height: 18px; }
    
    .step.completed .node {
      background-color: #10b981;
      color: white;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
    }
    .step.active .node {
      background-color: #3b82f6;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
      animation: pulse-node 2s infinite ease-in-out;
    }
    .step.failed .node {
      background-color: #ef4444;
      color: white;
    }

    .step p { margin: 0; font-size: 11px; font-weight: 700; color: var(--text-muted); }
    .step.completed p { color: var(--text-color); }
    .step.active p { color: var(--primary-color); }

    .connector {
      flex-grow: 1;
      height: 4px;
      background-color: var(--border-color);
      margin-top: -24px;
      z-index: 1;
      position: relative;
    }
    .connector.completed {
      background-color: #10b981;
    }
    .connector.active {
      background-color: #3b82f6;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      animation: flow-wave 1.5s infinite linear;
    }

    @keyframes pulse-node {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    }

    /* Logs view */
    .section-title {
      font-size: 15px;
      font-family: var(--font-heading);
      font-weight: 700;
      margin: 32px 0 16px 0;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 6px;
    }
    .logs-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .log-item {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px dashed var(--border-color);
    }
    .log-date {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
      min-width: 140px;
      font-weight: 500;
    }
    .log-info strong {
      font-size: 13px;
      display: inline-block;
      border-radius: 4px;
      font-weight: 700;
    }
    .log-info strong[data-status="SUBMITTED"] { color: #1e40af; }
    .log-info strong[data-status="UNDER_OCR"] { color: #d97706; }
    .log-info strong[data-status="INSPECTION_SCHEDULED"] { color: #86198f; }
    .log-info strong[data-status="APPROVED"] { color: #065f46; }
    .log-info strong[data-status="REJECTED"] { color: #991b1b; }
    
    .log-info p { margin: 4px 0 0 0; font-size: 13px; color: var(--text-muted); line-height: 1.4; }
  `]
})
export class TrackComponent implements OnInit {
  refNo = '';
  searched = false;
  appData: any = null;
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  trackApplication() {
    if (!this.refNo.trim()) return;
    this.searched = true;
    this.loading = true;

    // Simulate real-time lookup latency
    setTimeout(() => {
      this.http.get<any>('/api/public/application-status/' + this.refNo.trim()).subscribe({
        next: (res) => {
          this.appData = res;
          this.loading = false;
        },
        error: () => {
          // Fallback pre-seeded demo codes
          const val = this.refNo.trim().toUpperCase();
          if (val === 'AICTE-2026-MITP-001') {
            this.appData = {
              application: { refNo: "AICTE-2026-MITP-001", academicYear: "2026-27", overallStatus: "UNDER_OCR" },
              history: [
                { updatedAt: new Date(), status: "UNDER_OCR", remarks: "OCR extraction complete. Checking duplicate PAN/Aadhaar entries across peer institutions." },
                { updatedAt: new Date(Date.now() - 3600000), status: "SUBMITTED", remarks: "Application package successfully compiled and synchronized via SSO." }
              ]
            };
          } else if (val === 'AICTE-2026-DTU-99') {
            this.appData = {
              application: { refNo: "AICTE-2026-DTU-99", academicYear: "2026-27", overallStatus: "APPROVED" },
              history: [
                { updatedAt: new Date(), status: "APPROVED", remarks: "Board approval synthesized. Program approval certificate issued." },
                { updatedAt: new Date(Date.now() - 86400000), status: "INSPECTION_SCHEDULED", remarks: "EVC inspector review completed. Site physical specs matched." },
                { updatedAt: new Date(Date.now() - 172800000), status: "UNDER_OCR", remarks: "OCR extraction complete. Safety certificates validated." },
                { updatedAt: new Date(Date.now() - 259200000), status: "SUBMITTED", remarks: "Application package received." }
              ]
            };
          } else {
            this.appData = null;
          }
          this.loading = false;
        }
      });
    }, 600);
  }

  isStepCompleted(step: string): boolean {
    if (!this.appData) return false;
    const currentStatus = this.appData.application.overallStatus;
    const statuses = ['SUBMITTED', 'UNDER_OCR', 'INSPECTION_SCHEDULED', 'APPROVED', 'REJECTED'];
    
    // If approved/rejected, the flow is finished
    if (currentStatus === 'APPROVED' || currentStatus === 'REJECTED') {
      return true;
    }
    
    return statuses.indexOf(currentStatus) > statuses.indexOf(step);
  }

  isStepActive(step: string): boolean {
    if (!this.appData) return false;
    const currentStatus = this.appData.application.overallStatus;
    
    // REJECTED/APPROVED stop active pulsing
    if (currentStatus === 'APPROVED' || currentStatus === 'REJECTED') {
      return false;
    }
    
    return currentStatus === step;
  }
}
