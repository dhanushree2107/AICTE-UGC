import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div style="max-width: 900px; margin: 0 auto;">
      <mat-card style="padding: 24px;">
        <mat-card-header>
          <h2 style="font-size: 26px; margin: 0 0 16px 0;">Notices & Circulars</h2>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let notice of notices" style="border-bottom: 1px solid var(--border-color); padding: 16px 0;">
            <span style="font-size: 11px; background-color: var(--border-color); padding: 4px 8px; border-radius: 4px; font-weight: bold; color: var(--primary-color);">{{ notice.date }}</span>
            <h4 style="font-size: 16px; margin: 8px 0 4px 0;">{{ notice.title }}</h4>
            <p style="font-size: 13px; color: var(--text-muted); margin: 0;">{{ notice.content }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class NoticesComponent {
  notices = [
    { date: "July 05, 2026", title: "Guidelines for Hybrid inspections", content: "New directives for conducting digital-cum-physical peer inspections for UG institutes." },
    { date: "July 01, 2026", title: "Extension of Last Date for UG Application Submission", content: "AICTE has extended the last date for submitting approval requests to July 31, 2026." },
    { date: "June 01, 2026", title: "AICTE Approval Process Handbook 2026-27", content: "The Approval Process Handbook (APH) outlines rules for establishing and running UG programs." }
  ];
}
