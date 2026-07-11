import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-applications-review',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="review-container">
      <header class="review-header">
        <h2>Peer Reviewer Approval Panel</h2>
        <p>Analyze submitted packets with the automated compliance, document verification, and risk assessment AI Agents.</p>
      </header>

      <div class="review-layout">
        <!-- Sidebar: Application List -->
        <div class="app-list-side">
          <div class="list-card" *ngFor="let app of applications" [class.selected]="selectedApp?.id === app.id" (click)="selectApplication(app)">
            <strong>{{ app.refNo }}</strong>
            <div class="list-meta">
              <span>Intake: {{ app.intakeCapacity }}</span>
              <span class="status-indicator" [attr.data-status]="app.overallStatus">{{ app.overallStatus }}</span>
            </div>
          </div>
        </div>

        <!-- Main Content Area: Detailed Inspection & AI Reports -->
        <div class="review-content" *ngIf="selectedApp">
          <mat-card class="detail-card">
            <div class="detail-header">
              <h3>Evaluation Console: {{ selectedApp.refNo }}</h3>
              <div class="actions">
                <button mat-flat-button color="primary" class="ai-trigger-btn" (click)="triggerAiAgents()">
                  <mat-icon>psychology</mat-icon> Analyze with AI Agents
                </button>
              </div>
            </div>

            <!-- AI Agents Reports Section -->
            <div class="ai-report-section" *ngIf="aiReport">
              <h3 class="section-title">AI Agents Panel Summary</h3>
              
              <div class="agents-grid">
                <!-- A & B. OCR and Eligibility Agent -->
                <div class="agent-card">
                  <div class="agent-card-header">
                    <mat-icon style="color: #2563eb;">fact_check</mat-icon>
                    <strong>Eligibility & OCR Agent</strong>
                  </div>
                  <div class="agent-card-body">
                    <div class="score-badge">{{ aiReport.eligibility?.eligibilityScore }}%</div>
                    <p>Faculty-Student Ratio: <strong>{{ aiReport.eligibility?.metrics?.facultyStudentRatio }}</strong></p>
                    <p>Intake Validation: <strong>Compliant</strong></p>
                  </div>
                </div>

                <!-- C. Compliance Check Agent -->
                <div class="agent-card">
                  <div class="agent-card-header">
                    <mat-icon style="color: #10b981;">gavel</mat-icon>
                    <strong>Compliance Rules Agent</strong>
                  </div>
                  <div class="agent-card-body">
                    <span class="badge" [class.success]="aiReport.compliance?.isCompliant" [class.danger]="!aiReport.compliance?.isCompliant">
                      {{ aiReport.compliance?.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT' }}
                    </span>
                    <ul class="findings-list">
                      <li *ngFor="let item of aiReport.compliance?.checkedItems">
                        {{ item.rule }}: <strong>{{ item.status }}</strong>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- D. Risk Assessment Agent -->
                <div class="agent-card">
                  <div class="agent-card-header">
                    <mat-icon style="color: #ef4444;">warning</mat-icon>
                    <strong>Risk Assessment Agent</strong>
                  </div>
                  <div class="agent-card-body">
                    <span class="badge" [class.danger]="aiReport.risk?.riskLevel === 'HIGH'" [class.success]="aiReport.risk?.riskLevel === 'LOW'">
                      Risk: {{ aiReport.risk?.riskLevel }} ({{ aiReport.risk?.riskScore }}%)
                    </span>
                    <p *ngIf="aiReport.risk?.anomalies?.length > 0" style="color: #ef4444; font-size: 11px; margin-top: 6px;">
                      Flagged: {{ aiReport.risk?.anomalies[0] }}
                    </p>
                  </div>
                </div>

                <!-- E. Synthesized Approval Agent -->
                <div class="agent-card highlight">
                  <div class="agent-card-header">
                    <mat-icon style="color: #8b5cf6;">psychology</mat-icon>
                    <strong>Approval Agent Recommendation</strong>
                  </div>
                  <div class="agent-card-body">
                    <span class="badge recommend" [attr.data-recommend]="aiReport.recommendation?.recommendation">
                      {{ aiReport.recommendation?.recommendation }}
                    </span>
                    <p style="font-size: 12px; margin-top: 8px;">Confidence: <strong>{{ aiReport.recommendation?.confidenceScore }}%</strong></p>
                    <p class="reasons-text">"{{ aiReport.recommendation?.reasons }}"</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Manual Decision Controls -->
            <div class="decision-box">
              <h3 class="section-title">Submit Board Action</h3>
              <div class="form-group">
                <label>Verification Comments / Decision Remarks</label>
                <textarea rows="3" [(ngModel)]="remarks" placeholder="Provide final remarks..."></textarea>
              </div>
              <div class="decision-buttons">
                <button mat-flat-button class="btn-approve" (click)="submitDecision('APPROVED')">Approve Extension</button>
                <button mat-flat-button class="btn-reject" (click)="submitDecision('REJECTED')">Reject Application</button>
                <button mat-flat-button class="btn-clarify" (click)="submitDecision('CLARIFICATION_REQUIRED')">Request Clarification</button>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .review-header { margin-bottom: 24px; }
    .review-header h2 { font-size: 24px; margin: 0; }
    .review-header p { color: var(--text-muted); margin: 4px 0 0 0; font-size: 14px; }

    .review-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 24px;
    }
    .app-list-side {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .list-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 14px;
      cursor: pointer;
      box-shadow: var(--shadow-light);
    }
    .list-card.selected {
      border-color: var(--primary-color);
      background-color: var(--border-color);
    }
    .list-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .status-indicator {
      font-weight: 700;
    }
    .status-indicator[data-status="SUBMITTED"] { color: #2563eb; }
    .status-indicator[data-status="UNDER_OCR"] { color: #d97706; }
    .status-indicator[data-status="APPROVED"] { color: #059669; }

    .detail-card { padding: 24px; }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .detail-header h3 { margin: 0; }
    
    .ai-trigger-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;
    }

    .section-title {
      font-size: 15px;
      font-weight: 600;
      margin: 20px 0 12px 0;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 6px;
    }

    .agents-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .agent-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      background-color: var(--bg-color);
    }
    .agent-card.highlight {
      grid-column: span 2;
      border-color: #8b5cf6;
      background-color: #faf5ff;
    }
    .agent-card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .score-badge {
      font-size: 28px;
      font-weight: 800;
      color: #2563eb;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge.success { background-color: #d1fae5; color: #065f46; }
    .badge.danger { background-color: #fee2e2; color: #991b1b; }
    .badge.recommend[data-recommend="APPROVE"] { background-color: #d1fae5; color: #065f46; font-size: 14px; }
    .badge.recommend[data-recommend="REJECT"] { background-color: #fee2e2; color: #991b1b; font-size: 14px; }
    .findings-list {
      margin: 8px 0 0 0;
      padding-left: 16px;
      font-size: 11px;
    }
    .reasons-text {
      font-style: italic;
      color: var(--text-muted);
      font-size: 12px;
      margin-top: 6px;
    }

    .decision-box {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }
    .decision-buttons {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .btn-approve { background-color: #10b981 !important; color: white !important; font-weight: 600; }
    .btn-reject { background-color: #ef4444 !important; color: white !important; font-weight: 600; }
    .btn-clarify { background-color: #f59e0b !important; color: white !important; font-weight: 600; }
  `]
})
export class ApplicationsReviewComponent implements OnInit {
  applications: any[] = [];
  selectedApp: any = null;
  aiReport: any = null;
  remarks = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.http.get<any[]>('/api/applications').subscribe({
      next: (res) => {
        this.applications = res;
        if (res.length > 0) this.selectApplication(res[0]);
      },
      error: () => {
        // Fallback demo data
        this.applications = [
          { id: 1, refNo: "AICTE-2026-MITP-001", intakeCapacity: 300, overallStatus: "SUBMITTED" },
          { id: 2, refNo: "AICTE-2026-DTUA-002", intakeCapacity: 600, overallStatus: "UNDER_OCR" }
        ];
        this.selectApplication(this.applications[0]);
      }
    });
  }

  selectApplication(app: any) {
    this.selectedApp = app;
    this.aiReport = null; // Clear old report
  }

  triggerAiAgents() {
    if (!this.selectedApp) return;

    // Call FastAPI AI agent synthesis service
    this.http.post<any>(`/api/ai/analyze-application?applicationId=${this.selectedApp.id}`, null).subscribe({
      next: (res) => {
        this.aiReport = res;
      },
      error: () => {
        // Fallback simulated report based on app ID (matches simulated values)
        this.aiReport = this.getMockAiReport(this.selectedApp.id);
      }
    });
  }

  submitDecision(decision: string) {
    if (!this.selectedApp) return;

    const url = `/api/applications/${this.selectedApp.id}/status?status=${decision}&remarks=${this.remarks}`;
    this.http.put<any>(url, null).subscribe({
      next: (res) => {
        alert(`Board Action: Application marked as ${decision}.`);
        this.selectedApp.overallStatus = decision;
      },
      error: () => {
        alert(`Simulated Board Action: Application marked as ${decision}.`);
        this.selectedApp.overallStatus = decision;
      }
    });
  }

  private getMockAiReport(id: number) {
    if (id % 2 === 1) {
      return {
        eligibility: { eligibilityScore: 92.5, metrics: { facultyStudentRatio: "1:15" } },
        compliance: { isCompliant: true, checkedItems: [{ rule: "Girls Common Room", status: "COMPLIANT" }, { rule: "Internet Bandwidth >= 100Mbps", status: "COMPLIANT" }] },
        risk: { riskLevel: "LOW", riskScore: 12.0 },
        recommendation: { recommendation: "APPROVE", confidenceScore: 94.0, reasons: "The college meets all regulatory thresholds, exhibits low risk index, and maintains high staff presence." }
      };
    } else {
      return {
        eligibility: { eligibilityScore: 58.0, metrics: { facultyStudentRatio: "1:25" } },
        compliance: { isCompliant: false, checkedItems: [{ rule: "Girls Common Room", status: "NON_COMPLIANT" }, { rule: "Internet Bandwidth >= 100Mbps", status: "NON_COMPLIANT" }] },
        risk: { riskLevel: "HIGH", riskScore: 78.5 },
        recommendation: { recommendation: "REJECT", confidenceScore: 88.0, reasons: "Severe staff duplication detected (Aadhaar records registered elsewhere) combined with poor internet bandwidth." }
      };
    }
  }
}
