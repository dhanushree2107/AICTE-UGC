import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface TimelineEvent {
  date: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: string;
  showDetails: boolean;
}

@Component({
  selector: 'app-dates',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dates-container">
      <header class="dates-header">
        <h2>Timelines & Milestones</h2>
        <p>Stay updated on key deadlines and critical audit cycles for the 2026-27 Undergraduate program approval process.</p>
      </header>

      <!-- Timeline Component -->
      <div class="timeline">
        <!-- central track line -->
        <div class="timeline-line"></div>

        <div 
          *ngFor="let ev of events" 
          class="timeline-item"
          [class.completed]="ev.status === 'completed'"
          [class.current]="ev.status === 'current'"
          [class.upcoming]="ev.status === 'upcoming'"
          (mouseenter)="ev.showDetails = true"
          (mouseleave)="ev.showDetails = false"
        >
          <!-- timeline dot indicator -->
          <div class="timeline-badge">
            <mat-icon>{{ ev.icon }}</mat-icon>
          </div>

          <!-- event details card -->
          <div class="timeline-panel">
            <div class="panel-header">
              <span class="date-tag">{{ ev.date }}</span>
              <span class="status-indicator">{{ ev.status }}</span>
            </div>
            
            <h4>{{ ev.title }}</h4>
            <p class="summary-desc">{{ ev.shortDesc }}</p>
            
            <!-- Hover details transition -->
            <div class="details-collapse" [class.expanded]="ev.showDetails">
              <div class="details-content">
                <mat-icon class="info-icon">info</mat-icon>
                <span>{{ ev.detailedDesc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dates-container {
      max-width: 850px;
      margin: 0 auto;
      padding-bottom: 40px;
    }
    .dates-header { text-align: center; margin-bottom: 48px; }
    .dates-header h2 { font-size: 26px; margin: 0; font-family: var(--font-heading); font-weight: 800; }
    .dates-header p { color: var(--text-muted); margin: 6px 0 0 0; font-size: 14px; max-width: 600px; margin-left: auto; margin-right: auto; }

    /* Timeline architecture */
    .timeline {
      position: relative;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    .timeline-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 30px;
      width: 4px;
      background-color: var(--border-color);
      border-radius: 2px;
      z-index: 1;
    }

    .timeline-item {
      position: relative;
      display: flex;
      gap: 28px;
      align-items: flex-start;
      padding-left: 12px;
    }

    /* Badge dot styling */
    .timeline-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--card-bg);
      border: 3px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      flex-shrink: 0;
      transition: background-color 0.3s, border-color 0.3s, transform 0.3s;
    }
    .timeline-badge mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--text-muted); }

    /* Alternate event states */
    .timeline-item.completed .timeline-badge {
      border-color: #10b981;
      background-color: #d1fae5;
    }
    .timeline-item.completed .timeline-badge mat-icon { color: #047857; }

    .timeline-item.current .timeline-badge {
      border-color: #3b82f6;
      background-color: #dbeafe;
      transform: scale(1.15);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
    }
    .timeline-item.current .timeline-badge mat-icon { color: #1d4ed8; }

    .timeline-item.upcoming .timeline-badge {
      border-color: var(--border-color);
      background-color: var(--bg-color);
    }

    /* Timeline Panel */
    .timeline-panel {
      flex-grow: 1;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.01);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s, border-color 0.3s;
      position: relative;
    }
    .timeline-item:hover .timeline-panel {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
      border-color: var(--primary-color);
    }
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .date-tag {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary-color);
      background-color: rgba(59, 130, 246, 0.06);
      padding: 4px 10px;
      border-radius: 12px;
    }
    .status-indicator {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: var(--border-color);
      color: var(--text-muted);
    }
    .timeline-item.completed .status-indicator { background-color: #d1fae5; color: #047857; }
    .timeline-item.current .status-indicator { background-color: #dbeafe; color: #1d4ed8; }

    .timeline-panel h4 { font-size: 16px; margin: 0 0 4px 0; font-family: var(--font-heading); font-weight: 700; }
    .summary-desc { font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.4; }

    /* Hover Details Slide and Fade */
    .details-collapse {
      height: 0;
      opacity: 0;
      overflow: hidden;
      transition: height 0.35s ease, opacity 0.35s ease, margin-top 0.35s ease;
    }
    .details-collapse.expanded {
      height: 48px;
      opacity: 1;
      margin-top: 14px;
    }
    .details-content {
      border-top: 1px solid var(--border-color);
      padding-top: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-color);
      line-height: 1.3;
    }
    .info-icon { font-size: 16px; width: 16px; height: 16px; color: var(--primary-color); flex-shrink: 0; }
  `]
})
export class DatesComponent {
  events: TimelineEvent[] = [
    {
      date: 'June 01, 2026',
      title: 'Portal Launch & Submission Start',
      shortDesc: 'AICTE UG approval system is open for fresh applications and renewal drafts.',
      detailedDesc: 'Ensure your institution registered profile details are fully updated prior to drafting technical approval request packages.',
      status: 'completed',
      icon: 'launch',
      showDetails: false
    },
    {
      date: 'July 31, 2026',
      title: 'Application Submission Deadline',
      shortDesc: 'Last date to submit application packages along with standard deposits.',
      detailedDesc: 'AI compliance validation agents freeze verification cycles at midnight. Late entries require manual committee waiver authorizations.',
      status: 'current',
      icon: 'alarm',
      showDetails: false
    },
    {
      date: 'Aug 01 - Sep 15, 2026',
      title: 'Expert Visit Committee Inspection',
      shortDesc: 'Physical inspections of safety infrastructure and laboratory equipment.',
      detailedDesc: 'Regional officers execute live video verification and log site dimensions directly using technical assessment tablets.',
      status: 'upcoming',
      icon: 'business_center',
      showDetails: false
    },
    {
      date: 'September 30, 2026',
      title: 'Final Approval Orders Released',
      shortDesc: 'Official Board approval orders published online.',
      detailedDesc: 'Approved programs will receive formal certificates signed by the AICTE council registrar mapped to OIDC credentials.',
      status: 'upcoming',
      icon: 'verified',
      showDetails: false
    }
  ];
}
