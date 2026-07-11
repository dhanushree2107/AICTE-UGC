import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div style="max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 24px; margin-bottom: 20px;">Notifications Center</h2>
      <mat-card style="padding: 16px;">
        <div *ngFor="let notif of notifications" style="border-bottom: 1px solid var(--border-color); padding: 16px 0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0; font-size: 15px;" [style.font-weight]="notif.read ? 'normal' : 'bold'">{{ notif.title }}</h4>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--text-muted);">{{ notif.message }}</p>
          </div>
          <button mat-icon-button *ngIf="!notif.read" (click)="notif.read = true" title="Mark as Read">
            <mat-icon style="color: blue;">done</mat-icon>
          </button>
        </div>
        <div *ngIf="notifications.length === 0" style="text-align: center; padding: 20px; color: var(--text-muted);">
          No active alerts.
        </div>
      </mat-card>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  notifications = [
    { title: "Inspection Scheduled", message: "Expert committee scheduled to visit Maharashtra Institute of Technology on August 15, 2026.", read: false },
    { title: "Document Verified", message: "Land registration deed REG-LAND-998877 verified successfully by AI OCR Agent.", read: true }
  ];
  ngOnInit() {}
}
