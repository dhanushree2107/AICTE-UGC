import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="apps-container">
      <header class="apps-header">
        <h2>Submit UG Approval Application</h2>
        <p>Submit academic details, upload land deeds, building layouts, and trigger automated AI check reports.</p>
      </header>

      <!-- Step 1: Create Application -->
      <div class="form-card" *ngIf="!submittedApplication">
        <h3>Start Approval Package</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Academic Year</label>
            <select [(ngModel)]="newApp.academicYear">
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
            </select>
          </div>
          <div class="form-group">
            <label>Intake capacity</label>
            <input type="number" [(ngModel)]="newApp.intake" />
          </div>
        </div>
        <button mat-flat-button color="primary" class="action-btn" (click)="startApplication()">
          Create Application Package
        </button>
      </div>

      <!-- Step 2: Upload Documents -->
      <div class="submitted-application" *ngIf="submittedApplication">
        <mat-card class="app-info-card">
          <div class="card-header-row">
            <h3>Package: {{ submittedApplication.refNo }}</h3>
            <span class="status-badge">{{ submittedApplication.overallStatus }}</span>
          </div>

          <div class="doc-upload-section">
            <h4>Mandatory Document Checklist</h4>
            
            <div class="doc-row" *ngFor="let doc of docChecklist">
              <div class="doc-label">
                <mat-icon style="color: var(--text-muted);">insert_drive_file</mat-icon>
                <div>
                  <strong>{{ doc.type }}</strong>
                  <p>Upload PDF copy below 10MB</p>
                </div>
              </div>
              <div class="upload-controls">
                <input type="file" (change)="selectFile($event, doc.type)" style="display: none;" #fileInput />
                
                <button mat-stroked-button *ngIf="!doc.uploadedFile" (click)="fileInput.click()">
                  <mat-icon>upload_file</mat-icon> Select File
                </button>
                <span class="uploaded-name" *ngIf="doc.uploadedFile">
                  <mat-icon style="color: green;">check_circle</mat-icon> {{ doc.uploadedFile.name }}
                </span>
              </div>
            </div>
            
            <button mat-flat-button color="accent" class="action-btn" style="margin-top: 24px;" (click)="submitAllDocs()">
              <mat-icon>send</mat-icon> Submit for AI Document verification
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .apps-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .apps-header { margin-bottom: 24px; }
    .apps-header h2 { font-size: 24px; margin: 0; }
    .apps-header p { color: var(--text-muted); margin: 4px 0 0 0; font-size: 14px; }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .action-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;
    }

    .app-info-card {
      padding: 24px;
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .card-header-row h3 { margin: 0; }
    .status-badge {
      background-color: #dbeafe;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
    }

    .doc-upload-section h4 {
      font-size: 16px;
      margin-bottom: 16px;
    }
    .doc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background-color: var(--bg-color);
      margin-bottom: 12px;
    }
    .doc-label {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .doc-label strong { font-size: 14px; display: block; }
    .doc-label p { margin: 2px 0 0 0; font-size: 11px; color: var(--text-muted); }
    .uploaded-name {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  newApp = { academicYear: '2026-27', intake: 300 };
  submittedApplication: any = null;

  docChecklist = [
    { type: 'Land Document', uploadedFile: null as any },
    { type: 'Building Plan', uploadedFile: null as any },
    { type: 'Faculty List', uploadedFile: null as any },
    { type: 'Audit Report', uploadedFile: null as any }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  startApplication() {
    // Generate simulated reference code
    const refNo = "AICTE-2026-" + Math.floor(1000 + Math.random() * 9000);
    this.submittedApplication = {
      refNo: refNo,
      overallStatus: 'SUBMITTED'
    };
    alert("Application package started successfully! Please upload documents.");
  }

  selectFile(event: any, docType: string) {
    const file = event.target.files[0];
    if (!file) return;

    const checklistItem = this.docChecklist.find(item => item.type === docType);
    if (checklistItem) {
      checklistItem.uploadedFile = file;
    }
  }

  submitAllDocs() {
    const allUploaded = this.docChecklist.every(item => item.uploadedFile !== null);
    if (!allUploaded) {
      alert("Please upload all mandatory documents before triggering AI verification.");
      return;
    }
    
    alert("All documents uploaded! Submitting package for automated OCR and compliance check.");
    this.submittedApplication.overallStatus = "UNDER_OCR";
  }
}
