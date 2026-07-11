import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div style="max-width: 900px; margin: 0 auto;">
      <mat-card style="padding: 24px;">
        <mat-card-header>
          <h2 style="font-size: 26px; margin: 0 0 16px 0;">AICTE UG Approval Process</h2>
        </mat-card-header>
        <mat-card-content style="line-height: 1.6; font-size: 14px;">
          <p>
            The approval process follows a step-by-step workflow:
          </p>
          <ol style="padding-left: 20px;">
            <li><strong>Online Submission:</strong> College admin registers institute details, programs, faculty, and infrastructure on portal.</li>
            <li><strong>AI OCR Verification:</strong> AI Document Agent scans uploaded documents for blur, validity, and credentials.</li>
            <li><strong>Compliance Analysis:</strong> AI Agents compute faculty ratios and cross-verify regulatory compliance.</li>
            <li><strong>Peer Inspection:</strong> Expert committee schedules digital or physical inspections to verify facilities.</li>
            <li><strong>Board Decision:</strong> The regional officer and board review recommendations and issue approval certificates.</li>
          </ol>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ProcessComponent {}
