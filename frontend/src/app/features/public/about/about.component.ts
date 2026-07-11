import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="about-container">
      <!-- Hero Header Section -->
      <section class="about-hero animate-fade-in">
        <h2>About AICTE UG Approval</h2>
        <p class="subtitle">Ensuring standards, transparency, and innovation in technical education across India.</p>
        <div class="glow-effect"></div>
      </section>

      <!-- Mission Statement Section -->
      <section class="mission-section animate-slide-up">
        <mat-card class="mission-card">
          <div class="card-icon-header">
            <mat-icon class="large-icon">gavel</mat-icon>
            <h3>Our Regulatory Mandate</h3>
          </div>
          <p>
            The All India Council for Technical Education (AICTE) was established in 1945 as an advisory body 
            and later given statutory status by an Act of Parliament in 1987. AICTE's mandate is to plan, formulate, 
            and maintain norms and standards in technical education across the country, ensuring quality, equity, 
            and global competitiveness.
          </p>
        </mat-card>
      </section>

      <!-- Core Pillars Grid -->
      <h3 class="section-title">Core Pillars of AICTE Governance</h3>
      <div class="pillars-grid">
        <div class="pillar-card delay-1">
          <div class="pillar-icon-box blue">
            <mat-icon>verified</mat-icon>
          </div>
          <h4>Quality Standards</h4>
          <p>Enforcing mandatory faculty-to-student ratios (1:20), classroom dimensions, and library holdings to ensure premium learning environments.</p>
        </div>

        <div class="pillar-card delay-2">
          <div class="pillar-icon-box gold">
            <mat-icon>psychology</mat-icon>
          </div>
          <h4>AI-Driven Verification</h4>
          <p>Leveraging state-of-the-art AI agents to analyze applications, cross-verify Aadhaar/PAN registries, and complete automated OCR checks.</p>
        </div>

        <div class="pillar-card delay-3">
          <div class="pillar-icon-box green">
            <mat-icon>security</mat-icon>
          </div>
          <h4>Safety & Trust</h4>
          <p>Mandating fire safety certificates, occupational health compliance, land title documentation, and structural integrity reviews.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Hero Banner styles */
    .about-hero {
      position: relative;
      background: var(--primary-gradient);
      color: white;
      padding: 48px 32px;
      border-radius: 20px;
      text-align: center;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
    }
    .about-hero h2 { font-size: 32px; margin: 0 0 12px 0; font-family: var(--font-heading); font-weight: 800; }
    .about-hero .subtitle { font-size: 16px; opacity: 0.9; margin: 0; max-width: 600px; margin: 0 auto; }
    
    .glow-effect {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    /* Mission card styling */
    .mission-section {
      margin-top: 8px;
    }
    .mission-card {
      padding: 32px;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 20px rgba(0,0,0,0.02) !important;
      border-radius: 16px !important;
    }
    .card-icon-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    .card-icon-header h3 { font-size: 20px; margin: 0; font-family: var(--font-heading); font-weight: 700; }
    .large-icon { font-size: 32px; width: 32px; height: 32px; color: var(--primary-color); }
    .mission-card p { line-height: 1.7; color: var(--text-color); margin: 0; font-size: 15px; opacity: 0.95; }

    /* Pillars Grid */
    .section-title {
      font-size: 20px;
      font-family: var(--font-heading);
      font-weight: 700;
      margin: 16px 0 0 0;
      text-align: center;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    .pillar-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      animation: slide-up-card 0.6s ease both;
    }
    .pillar-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.06);
    }
    .pillar-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .pillar-icon-box mat-icon { color: white; }
    .pillar-icon-box.blue { background-color: #3b82f6; }
    .pillar-icon-box.gold { background-color: #eab308; }
    .pillar-icon-box.green { background-color: #10b981; }

    .pillar-card h4 { font-size: 18px; margin: 0 0 8px 0; font-family: var(--font-heading); font-weight: 600; }
    .pillar-card p { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0; }

    /* Animation Classes */
    .animate-fade-in {
      animation: fade-in-anim 0.8s ease both;
    }
    .animate-slide-up {
      animation: slide-up-card 0.8s ease both;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }

    @keyframes fade-in-anim {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-up-card {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AboutComponent {}
