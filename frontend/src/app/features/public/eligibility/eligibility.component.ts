import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Criterion {
  id: string;
  title: string;
  desc: string;
  checked: boolean;
}

@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="eligibility-container">
      <header class="page-header">
        <h2>Eligibility Self-Assessment</h2>
        <p>Verify if your institution meets all baseline criteria required for AICTE Undergraduate Program approvals.</p>
      </header>

      <div class="layout-grid">
        <!-- Checklist Form Column -->
        <div class="checklist-section">
          <h3>Compliance Checklist</h3>
          <p class="subtitle">Select the options matching your college's current state to calculate compliance scores.</p>
          
          <div class="checklist-list">
            <div 
              *ngFor="let item of criteria" 
              class="check-item" 
              [class.checked]="item.checked"
              (click)="toggleCriterion(item)"
            >
              <div class="check-box-emulated">
                <mat-icon *ngIf="item.checked" class="check-anim">check</mat-icon>
              </div>
              <div class="item-text">
                <strong>{{ item.title }}</strong>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Compliance Score Dashboard -->
        <div class="result-sidebar">
          <mat-card class="result-card">
            <h3>Assessment Result</h3>
            
            <!-- Circular Progress Indicator -->
            <div class="progress-container">
              <svg class="progress-ring" width="160" height="160">
                <circle class="ring-bg" stroke="#f1f5f9" stroke-width="12" fill="transparent" r="70" cx="80" cy="80"/>
                <circle 
                  class="ring-progress" 
                  stroke="url(#progressGrad)" 
                  stroke-width="12" 
                  stroke-linecap="round"
                  fill="transparent" 
                  r="70" 
                  cx="80" 
                  cy="80"
                  [attr.stroke-dasharray]="dashArray"
                  [attr.stroke-dashoffset]="dashOffset"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" x2="100%">
                    <stop offset="0%" stop-color="#3b82f6" />
                    <stop offset="100%" stop-color="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="progress-text">
                <span class="percentage">{{ getPercentage() }}%</span>
                <span class="fraction">{{ getCheckedCount() }}/{{ criteria.length }} Met</span>
              </div>
            </div>

            <!-- Qualification Status -->
            <div class="status-box" [class.passed]="getCheckedCount() === criteria.length" [class.warning]="getCheckedCount() < criteria.length && getCheckedCount() >= 4" [class.failed]="getCheckedCount() < 4">
              <mat-icon>{{ getStatusIcon() }}</mat-icon>
              <div>
                <strong>{{ getStatusTitle() }}</strong>
                <p>{{ getStatusDesc() }}</p>
              </div>
            </div>

            <button mat-flat-button color="primary" class="apply-btn" [disabled]="getCheckedCount() < criteria.length">
              Proceed to Application
            </button>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eligibility-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .page-header { margin-bottom: 32px; }
    .page-header h2 { font-size: 26px; margin: 0; font-family: var(--font-heading); font-weight: 800; }
    .page-header p { color: var(--text-muted); margin: 4px 0 0 0; font-size: 14px; }

    .layout-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 28px;
    }

    .checklist-section h3 { font-size: 20px; margin: 0 0 4px 0; font-family: var(--font-heading); font-weight: 700; }
    .subtitle { font-size: 13px; color: var(--text-muted); margin: 0 0 24px 0; }

    .checklist-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Checkbox item cards */
    .check-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background-color: var(--card-bg);
      cursor: pointer;
      user-select: none;
      transition: transform 0.2s, border-color 0.2s, background-color 0.2s;
    }
    .check-item:hover {
      transform: translateX(4px);
      border-color: var(--primary-color);
      background-color: rgba(59, 130, 246, 0.02);
    }
    .check-item.checked {
      border-color: #10b981;
      background-color: rgba(16, 185, 129, 0.02);
    }

    .check-box-emulated {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s, border-color 0.2s;
      flex-shrink: 0;
    }
    .check-item.checked .check-box-emulated {
      background-color: #10b981;
      border-color: #10b981;
    }
    .check-box-emulated mat-icon {
      color: white;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* checkmark entrance animation */
    .check-anim {
      animation: check-scale 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    }
    @keyframes check-scale {
      from { transform: scale(0.3); opacity: 0; }
      to { transform: scale(1.1); opacity: 1; }
    }

    .item-text strong { font-size: 14px; display: block; color: var(--text-color); }
    .item-text p { font-size: 12px; color: var(--text-muted); margin: 2px 0 0 0; line-height: 1.4; }

    /* Results Dashboard Column */
    .result-card {
      padding: 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid var(--border-color);
    }
    .result-card h3 { font-size: 16px; margin: 0 0 20px 0; font-family: var(--font-heading); font-weight: 700; width: 100%; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; }

    /* Circular SVG Gauge */
    .progress-container {
      position: relative;
      margin-bottom: 24px;
    }
    .progress-ring {
      transform: rotate(-90deg);
    }
    .ring-progress {
      transition: stroke-dashoffset 0.35s;
    }
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
    }
    .progress-text .percentage {
      font-size: 24px;
      font-weight: 800;
      color: var(--text-color);
    }
    .progress-text .fraction {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Qualification status banner */
    .status-box {
      display: flex;
      align-items: center;
      gap: 12px;
      text-align: left;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 12px;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 20px;
    }
    .status-box mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .status-box strong { display: block; margin-bottom: 2px; }
    .status-box p { margin: 0; line-height: 1.3; opacity: 0.9; }

    .status-box.passed { background-color: #d1fae5; color: #065f46; }
    .status-box.warning { background-color: #fef3c7; color: #92400e; }
    .status-box.failed { background-color: #fee2e2; color: #991b1b; }

    .apply-btn {
      width: 100%;
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 700;
      padding: 10px;
      border-radius: 8px;
    }
    .apply-btn:disabled {
      background: #e2e8f0 !important;
      color: #94a3b8 !important;
    }
  `]
})
export class EligibilityComponent {
  criteria: Criterion[] = [
    { id: 'ratio', title: 'Faculty-to-Student Ratio', desc: 'Maintain 1:20 ratio for technical branches.', checked: false },
    { id: 'principal', title: 'Ph.D. Qualified Principal', desc: 'Principal/Director must hold an active doctoral degree.', checked: false },
    { id: 'infra', title: 'Space Specifications', desc: 'Classrooms >= 66 sqm, Labs >= 120 sqm.', checked: false },
    { id: 'computer', title: 'Computer Center', desc: 'Dedicated terminal labs with >100 Mbps broadband connectivity.', checked: false },
    { id: 'girls', title: 'Girls Common Room', desc: 'Mandatory common rooms with standard amenities.', checked: false },
    { id: 'safety', title: 'Safety Certificates', desc: 'Valid Fire Safety, Structural Stability, and Land Use documents.', checked: false }
  ];

  dashArray = 2 * Math.PI * 70; // 439.82

  toggleCriterion(item: Criterion) {
    item.checked = !item.checked;
  }

  getCheckedCount(): number {
    return this.criteria.filter(c => c.checked).length;
  }

  getPercentage(): number {
    return Math.round((this.getCheckedCount() / this.criteria.length) * 100);
  }

  get dashOffset(): number {
    const percent = this.getPercentage();
    return this.dashArray - (percent / 100) * this.dashArray;
  }

  getStatusIcon(): string {
    const count = this.getCheckedCount();
    if (count === this.criteria.length) return 'check_circle';
    if (count >= 4) return 'warning';
    return 'cancel';
  }

  getStatusTitle(): string {
    const count = this.getCheckedCount();
    if (count === this.criteria.length) return 'Fully Qualified';
    if (count >= 4) return 'Conditionally Eligible';
    return 'Not Eligible';
  }

  getStatusDesc(): string {
    const count = this.getCheckedCount();
    if (count === this.criteria.length) return 'All norms are satisfied. You may initiate submission packages.';
    if (count >= 4) return 'Baseline norms met, but missing critical safety certificates.';
    return 'Infrastructure metrics or safety documentation do not satisfy requirements.';
  }
}
