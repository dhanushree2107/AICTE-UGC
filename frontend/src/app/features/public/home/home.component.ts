import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-container">
      <!-- Premium Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <span class="badge">AICTE UG Approval 2026-27</span>
          <h2 class="hero-title">Academic Governance powered by AI Agents</h2>
          <p class="hero-description">
            Streamlining institutional compliance and program approvals with automated OCR document verification,
            compliance scoring, duplicate checking, and risk metrics.
          </p>
          <div class="hero-actions">
            <a routerLink="/track" mat-flat-button color="accent" class="cta-btn">
              <mat-icon>track_changes</mat-icon> Track Application Status
            </a>
            <a routerLink="/process" mat-stroked-button class="cta-btn-alt">
              Learn Approval Process
            </a>
          </div>
        </div>
        <div class="hero-graphic">
          <div class="ai-orb-container">
            <div class="ai-orb-core"></div>
            <div class="ai-orb-ring ring-1"></div>
            <div class="ai-orb-ring ring-2"></div>
            <div class="ai-orb-ring ring-3"></div>
            <div class="ai-scan-bar"></div>
            <div class="ai-particles">
              <div class="particle p-1"></div>
              <div class="particle p-2"></div>
              <div class="particle p-3"></div>
              <div class="particle p-4"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Analytics Metrics Panel -->
      <section class="metrics-container">
        <div class="metric-card">
          <div class="metric-icon blue-theme">
            <span class="material-icons">business</span>
          </div>
          <div class="metric-data">
            <h3>14,250+</h3>
            <p>Registered Institutes</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon gold-theme">
            <span class="material-icons">verified</span>
          </div>
          <div class="metric-data">
            <h3>9,820+</h3>
            <p>Approved Programs</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon green-theme">
            <span class="material-icons">query_stats</span>
          </div>
          <div class="metric-data">
            <h3>99.4%</h3>
            <p>AI Validation Accuracy</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon purple-theme">
            <span class="material-icons">bolt</span>
          </div>
          <div class="metric-data">
            <h3>2.4 Hours</h3>
            <p>Avg. Verification Time</p>
          </div>
        </div>
      </section>

      <!-- Circulars & Main Info Panel -->
      <div class="info-grid">
        <!-- Announcements Banner -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Latest Notifications & Circulars</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ul class="announcement-list">
              <li>
                <span class="date-chip">July 05</span>
                <p>New guidelines issued for physical inspections of computer infrastructure.</p>
              </li>
              <li>
                <span class="date-chip">July 01</span>
                <p>Deadline extension: UG Approval portal remains open until July 31, 2026.</p>
              </li>
              <li>
                <span class="date-chip">June 15</span>
                <p>Compliance guidelines handbook for B.Tech programs published.</p>
              </li>
            </ul>
            <a routerLink="/notices" class="read-more-link">View All Circulars <mat-icon>arrow_forward</mat-icon></a>
          </mat-card-content>
        </mat-card>

        <!-- Dynamic Dates Banner -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Important Dates</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="timeline-event">
              <span class="material-icons event-icon">rocket_launch</span>
              <div>
                <h4>Portal Opening</h4>
                <p>June 01, 2026 - Applications Open</p>
              </div>
            </div>
            <div class="timeline-event warning">
              <span class="material-icons event-icon">hourglass_top</span>
              <div>
                <h4>Submission Deadline</h4>
                <p>July 31, 2026 - Portal Closure</p>
              </div>
            </div>
            <div class="timeline-event success">
              <span class="material-icons event-icon">fact_check</span>
              <div>
                <h4>Review & Commitee Evaluations</h4>
                <p>August 01 - September 15, 2026</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Floating AI Helpdesk Chatbot Widget -->
      <div class="chatbot-widget" [class.chat-open]="isChatOpen">
        <button class="chat-toggle-btn" (click)="toggleChat()">
          <mat-icon>{{ isChatOpen ? 'close' : 'chat' }}</mat-icon>
          <span class="chat-badge" *ngIf="!isChatOpen">AI Helpdesk</span>
        </button>

        <div class="chat-window" *ngIf="isChatOpen">
          <div class="chat-header">
            <span class="material-icons">support_agent</span>
            <div>
              <h4>AICTE Help Desk Agent</h4>
              <p>Online | Virtual Assistant</p>
            </div>
          </div>
          
          <div class="chat-messages" #scrollContainer>
            <div class="message" *ngFor="let msg of messages" [class.bot-msg]="msg.isBot" [class.user-msg]="!msg.isBot">
              <div class="message-bubble">{{ msg.text }}</div>
            </div>
            <div class="message bot-msg" *ngIf="isTyping">
              <div class="message-bubble loading-dots">Thinking...</div>
            </div>
          </div>

          <div class="chat-input-area">
            <input type="text" [(ngModel)]="userMessage" (keyup.enter)="sendMessage()" placeholder="Ask about deadlines, ratios..." />
            <button (click)="sendMessage()" mat-icon-button color="primary">
              <mat-icon>send</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    /* Hero banner styling */
    .hero-section {
      background: var(--primary-gradient);
      color: white;
      padding: 56px 40px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      position: relative;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }
    .hero-content {
      max-width: 60%;
    }
    .badge {
      background: rgba(255,255,255,0.15);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-bottom: 16px;
    }
    .hero-title {
      font-size: 38px;
      line-height: 1.2;
      margin: 0 0 16px 0;
      font-weight: 800;
      font-family: var(--font-heading);
    }
    .hero-description {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 28px;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 16px;
    }
    .cta-btn {
      background-color: var(--secondary-color) !important;
      color: #0f2b5c !important;
      font-weight: 700;
      padding: 12px 24px;
      border-radius: 8px;
    }
    .cta-btn-alt {
      border-color: rgba(255,255,255,0.3) !important;
      color: white !important;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 8px;
    }
    .hero-graphic {
      width: 220px;
      height: 220px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border-radius: 0;
    }
    .ai-orb-container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ai-orb-core {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: radial-gradient(circle, #ffe082 0%, #ff8f00 50%, #d84315 100%);
      box-shadow: 0 0 35px #ffb300, 0 0 70px rgba(255, 143, 0, 0.5);
      animation: pulse-core 3s infinite ease-in-out;
      z-index: 2;
    }
    .ai-orb-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px dashed rgba(255, 255, 255, 0.45);
      box-sizing: border-box;
    }
    .ring-1 {
      width: 120px;
      height: 120px;
      border-color: rgba(255, 224, 130, 0.6);
      animation: spin-clockwise 8s infinite linear;
    }
    .ring-2 {
      width: 170px;
      height: 170px;
      border-color: rgba(255, 255, 255, 0.35);
      border-style: dotted;
      animation: spin-counter-clockwise 12s infinite linear;
    }
    .ring-3 {
      width: 210px;
      height: 210px;
      border-color: rgba(255, 143, 0, 0.4);
      border-width: 1.5px;
      animation: spin-clockwise 18s infinite linear;
    }
    .ai-scan-bar {
      position: absolute;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #ffe082, #ff8f00, #ffe082, transparent);
      box-shadow: 0 0 15px #ff8f00;
      animation: scan-vertical 4s infinite ease-in-out;
      z-index: 3;
    }
    .ai-particles {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
    }
    .particle {
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: #ffe082;
      border-radius: 50%;
      box-shadow: 0 0 8px #ffe082;
      opacity: 0.8;
    }
    .p-1 { top: 20%; left: 30%; animation: float-particle-1 5s infinite ease-in-out; }
    .p-2 { top: 75%; left: 25%; animation: float-particle-2 6s infinite ease-in-out; }
    .p-3 { top: 35%; left: 75%; animation: float-particle-3 7s infinite ease-in-out; }
    .p-4 { top: 80%; left: 70%; animation: float-particle-4 5.5s infinite ease-in-out; }

    /* Keyframe Animations */
    @keyframes pulse-core {
      0%, 100% {
        transform: scale(0.92);
        box-shadow: 0 0 30px #ffb300, 0 0 60px rgba(255, 143, 0, 0.4);
      }
      50% {
        transform: scale(1.08);
        box-shadow: 0 0 45px #ffe082, 0 0 90px rgba(255, 224, 130, 0.7);
      }
    }
    @keyframes spin-clockwise {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spin-counter-clockwise {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes scan-vertical {
      0%, 100% { top: 10%; opacity: 0; }
      10%, 90% { opacity: 1; }
      50% { top: 90%; }
    }
    @keyframes float-particle-1 {
      0%, 100% { transform: translate(0, 0); opacity: 0.3; }
      50% { transform: translate(15px, -15px); opacity: 0.9; }
    }
    @keyframes float-particle-2 {
      0%, 100% { transform: translate(0, 0); opacity: 0.4; }
      50% { transform: translate(-10px, 20px); opacity: 1; }
    }
    @keyframes float-particle-3 {
      0%, 100% { transform: translate(0, 0); opacity: 0.3; }
      50% { transform: translate(20px, 15px); opacity: 0.8; }
    }
    @keyframes float-particle-4 {
      0%, 100% { transform: translate(0, 0); opacity: 0.4; }
      50% { transform: translate(-15px, -10px); opacity: 0.9; }
    }
    /* Metrics section */
    .metrics-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .metric-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-light);
    }
    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .blue-theme { background-color: #2563eb; }
    .gold-theme { background-color: #f59e0b; }
    .green-theme { background-color: #10b981; }
    .purple-theme { background-color: #8b5cf6; }
    .metric-data h3 {
      font-size: 24px;
      margin: 0;
      font-weight: 700;
    }
    .metric-data p {
      margin: 2px 0 0 0;
      font-size: 13px;
      color: var(--text-muted);
    }
    /* Info grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 40px;
    }
    .info-card {
      padding: 16px;
    }
    .announcement-list {
      list-style: none;
      padding: 0;
      margin: 16px 0;
    }
    .announcement-list li {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    .date-chip {
      background-color: var(--border-color);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      height: fit-content;
      white-space: nowrap;
    }
    .announcement-list p {
      margin: 0;
      font-size: 13px;
    }
    .read-more-link {
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      font-weight: 600;
      color: var(--primary-color);
      font-size: 13px;
    }
    .timeline-event {
      display: flex;
      gap: 12px;
      padding: 12px;
      border-left: 3px solid var(--primary-color);
      background-color: var(--bg-color);
      border-radius: 0 8px 8px 0;
      margin-bottom: 12px;
    }
    .timeline-event.warning { border-left-color: var(--secondary-color); }
    .timeline-event.success { border-left-color: #10b981; }
    .event-icon { color: var(--text-muted); }
    .timeline-event h4 { margin: 0; font-size: 14px; font-weight: 600; }
    .timeline-event p { margin: 2px 0 0 0; font-size: 12px; color: var(--text-muted); }
    
    /* Floating Chatbot Widget */
    .chatbot-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    .chat-toggle-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      position: relative;
    }
    .chat-badge {
      position: absolute;
      right: 64px;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: var(--text-color);
      padding: 6px 12px;
      border-radius: 12px;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 600;
      box-shadow: var(--shadow-light);
    }
    .chat-window {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 320px;
      height: 400px;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: fadeIn 0.25s ease-out;
    }
    .chat-header {
      background: var(--primary-gradient);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .chat-header h4 { margin: 0; font-size: 14px; }
    .chat-header p { margin: 0; font-size: 10px; opacity: 0.8; }
    .chat-messages {
      flex-grow: 1;
      padding: 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .message {
      display: flex;
      max-width: 80%;
    }
    .bot-msg { align-self: flex-start; }
    .user-msg { align-self: flex-end; }
    .message-bubble {
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.4;
    }
    .bot-msg .message-bubble {
      background-color: var(--border-color);
      color: var(--text-color);
      border-top-left-radius: 0;
    }
    .user-msg .message-bubble {
      background: var(--primary-gradient);
      color: white;
      border-top-right-radius: 0;
    }
    .chat-input-area {
      padding: 10px;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 8px;
      background-color: var(--bg-color);
    }
    .chat-input-area input {
      flex-grow: 1;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      outline: none;
    }
    .loading-dots {
      font-style: italic;
      color: var(--text-muted);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HomeComponent implements OnInit {
  isChatOpen = false;
  userMessage = '';
  isTyping = false;
  messages: Array<{ text: string; isBot: boolean }> = [
    { text: "Hello! I am the AICTE Help Desk Assistant. I can guide you with deadlines, faculty ratios, infrastructure rules, or help you track application statuses. What can I answer for you?", isBot: true }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    const userText = this.userMessage;
    this.messages.push({ text: userText, isBot: false });
    this.userMessage = '';
    this.isTyping = true;

    // Call FastAPI Help Desk agent
    this.http.post<any>('/api/ai/helpdesk/chat', { message: userText }).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.messages.push({ text: res.reply, isBot: true });
      },
      error: () => {
        this.isTyping = false;
        // Mock fallback rules if backend is not running yet
        const reply = this.getMockHelpdeskReply(userText);
        this.messages.push({ text: reply, isBot: true });
      }
    });
  }

  private getMockHelpdeskReply(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes("deadline") || msg.includes("dates")) {
      return "The deadline for AICTE UG Approval applications for 2026-27 is July 31, 2026.";
    } else if (msg.includes("ratio") || msg.includes("faculty")) {
      return "The mandatory faculty-to-student ratio is 1:20 for undergraduate engineering courses.";
    } else if (msg.includes("area") || msg.includes("classroom")) {
      return "Each classroom must be at least 66 square meters in area with audio-visual system enabled.";
    } else {
      return "I recommend reviewing the AICTE Approval Process Handbook 2026-27 or asking specific questions about infrastructure space, faculty ratios, or timelines.";
    }
  }
}
