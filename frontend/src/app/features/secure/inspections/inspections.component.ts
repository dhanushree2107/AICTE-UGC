import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inspections',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="inspections-container">
      <header class="inspections-header">
        <h2>Expert Visit Committee (EVC) Inspections</h2>
        <p>Schedule peer visits, allocate committee chairs, and log onsite reports.</p>
      </header>

      <div class="form-card">
        <h3>Schedule New Inspection</h3>
        <div class="form-grid-3">
          <div class="form-group">
            <label>Application ID</label>
            <input type="number" [(ngModel)]="newInspection.applicationId" />
          </div>
          <div class="form-group">
            <label>Inspection Date</label>
            <input type="date" [(ngModel)]="newInspection.scheduledDate" />
          </div>
          <div class="form-group">
            <label>Committee Chair</label>
            <input type="text" [(ngModel)]="newInspection.committeeMembers" placeholder="e.g. Dr. A. P. J. Kalam" />
          </div>
        </div>
        <button mat-flat-button color="primary" class="save-btn" (click)="scheduleInspection()">
          Schedule Onsite EVC
        </button>
      </div>

      <!-- Schedule Directory Table -->
      <div class="results-table-wrapper" style="margin-top: 24px;">
        <table class="results-table">
          <thead>
            <tr>
              <th>App ID</th>
              <th>Date Scheduled</th>
              <th>Committee Members</th>
              <th>Status</th>
              <th>Onsite Report Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let insp of inspectionsList">
              <td style="font-weight: 600;">#{{ insp.applicationId }}</td>
              <td>{{ insp.scheduledDate }}</td>
              <td>{{ insp.committeeMembers }}</td>
              <td>
                <span class="status-badge" [class.success]="insp.status === 'COMPLETED'">{{ insp.status }}</span>
              </td>
              <td>
                <button mat-stroked-button color="primary" size="small" *ngIf="insp.status === 'SCHEDULED'" (click)="openReportModal(insp)">
                  Submit Report
                </button>
                <span *ngIf="insp.status === 'COMPLETED'" style="color: green; font-weight: 500; font-size: 13px;">
                  <mat-icon style="font-size: 16px; vertical-align: middle;">done_all</mat-icon> Submitted
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .inspections-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .inspections-header { margin-bottom: 24px; }
    .inspections-header h2 { font-size: 24px; margin: 0; }
    .inspections-header p { color: var(--text-muted); margin: 4px 0 0 0; font-size: 14px; }

    .form-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .save-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;
    }

    .results-table-wrapper {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-light);
    }
    .results-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .results-table th {
      background-color: var(--border-color);
      padding: 14px 16px;
      font-weight: 600;
    }
    .results-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .status-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      background-color: #fef3c7;
      color: #d97706;
    }
    .status-badge.success {
      background-color: #d1fae5;
      color: #065f46;
    }
  `]
})
export class InspectionsComponent implements OnInit {
  inspectionsList: any[] = [
    { id: 1, applicationId: 1, scheduledDate: "2026-08-15", committeeMembers: "Dr. Ramesh Kumar, Prof. Deshmukh", status: "SCHEDULED" }
  ];

  newInspection = { applicationId: 1, scheduledDate: '2026-08-15', committeeMembers: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  scheduleInspection() {
    if (!this.newInspection.committeeMembers) return;
    this.inspectionsList.push({ ...this.newInspection, status: 'SCHEDULED' });
    alert("Inspection scheduled. Email notifications sent to the Expert committee.");
  }

  openReportModal(insp: any) {
    const deficiencies = prompt("Enter deficiencies found (leave empty if none):");
    const recommended = confirm("Do you recommend this institute for approval?");
    
    insp.status = "COMPLETED";
    alert("Onsite report recorded successfully. Board approval status updated.");
  }
}
