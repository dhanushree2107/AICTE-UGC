import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  open: boolean;
}

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="faq-container">
      <header class="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Find quick answers to queries regarding UG program requirements, digital submissions, and AI evaluation stages.</p>
      </header>

      <!-- Category Filter Tabs -->
      <div class="category-tabs">
        <button 
          *ngFor="let cat of categories"
          class="tab-btn"
          [class.active]="selectedCategory === cat"
          (click)="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <!-- FAQ Accordion List -->
      <div class="accordion-list">
        <div 
          *ngFor="let faq of filteredFaqs" 
          class="accordion-item"
          [class.open]="faq.open"
        >
          <!-- Accordion Header -->
          <div class="accordion-trigger" (click)="toggleFaq(faq)">
            <div class="header-content">
              <span class="q-badge">Q</span>
              <h4>{{ faq.question }}</h4>
            </div>
            <mat-icon class="chevron-icon">expand_more</mat-icon>
          </div>

          <!-- Accordion Content -->
          <div class="accordion-content-wrapper" [style.height]="faq.open ? getAccordionHeight(faq) : '0px'">
            <div class="accordion-content">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .faq-container {
      max-width: 800px;
      margin: 0 auto;
      padding-bottom: 40px;
    }
    .faq-header { text-align: center; margin-bottom: 32px; }
    .faq-header h2 { font-size: 26px; margin: 0; font-family: var(--font-heading); font-weight: 800; }
    .faq-header p { color: var(--text-muted); margin: 6px 0 0 0; font-size: 14px; }

    /* Category Filter Tabs */
    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .tab-btn {
      background: var(--bg-color);
      color: var(--text-color);
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      border-color: var(--primary-color);
      background-color: rgba(59, 130, 246, 0.02);
    }
    .tab-btn.active {
      background: var(--primary-gradient);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    /* Accordion items */
    .accordion-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .accordion-item {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.01);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .accordion-item:hover {
      border-color: var(--primary-color);
    }
    .accordion-item.open {
      border-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }

    .accordion-trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 24px;
      cursor: pointer;
      user-select: none;
    }
    .header-content {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .q-badge {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: rgba(59, 130, 246, 0.08);
      color: var(--primary-color);
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .header-content h4 {
      font-size: 14px;
      margin: 0;
      font-family: var(--font-heading);
      font-weight: 600;
      color: var(--text-color);
    }

    .chevron-icon {
      color: var(--text-muted);
      transition: transform 0.3s ease;
    }
    .accordion-item.open .chevron-icon {
      transform: rotate(180deg);
      color: var(--primary-color);
    }

    /* Content heights & transitions */
    .accordion-content-wrapper {
      height: 0;
      overflow: hidden;
      transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .accordion-content {
      padding: 0 24px 20px 64px;
      border-top: 1px dashed var(--border-color);
      padding-top: 16px;
    }
    .accordion-content p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }
  `]
})
export class FaqsComponent {
  categories = ['All', 'General Rules', 'Ratios & Space', 'AI Verification'];
  selectedCategory = 'All';

  faqs: FAQ[] = [
    {
      category: 'Ratios & Space',
      question: "What is the mandatory faculty-to-student ratio?",
      answer: "The mandatory ratio is 1:20 for undergraduate engineering courses, and 1:15 for architecture courses. AI Verification checks these ratios against structural payroll ledgers.",
      open: false
    },
    {
      category: 'AI Verification',
      question: "How does the AI document verification agent operate?",
      answer: "When you upload files, the compliance agent runs OCR to extract text parameters. It evaluates paper contrast, scans signature seals, and searches public registers to check validity.",
      open: false
    },
    {
      category: 'General Rules',
      question: "Can we modify a submitted application?",
      answer: "No. Once submitted, the application freezes. If structural errors are flagged by checking agents, you will receive an active notification center request to upload amendments.",
      open: false
    },
    {
      category: 'General Rules',
      question: "How long does the AI CTE Board approval take?",
      answer: "Standard validation scripts complete automated compliance indexing in 2-3 hours. Peer evaluation review processes usually finish within 30 days.",
      open: false
    },
    {
      category: 'AI Verification',
      question: "Are Aadhaar and PAN checkups mandatory?",
      answer: "Yes. The AI PAN/Aadhaar risk assessment agent evaluates principal and faculty credentials against national records to ensure transparency and prevent duplicate entries across campuses.",
      open: false
    }
  ];

  get filteredFaqs(): FAQ[] {
    if (this.selectedCategory === 'All') return this.faqs;
    return this.faqs.filter(f => f.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Collapse all on switch
    this.faqs.forEach(f => f.open = false);
  }

  toggleFaq(faq: FAQ) {
    const nextState = !faq.open;
    // Collapse others
    this.faqs.forEach(f => f.open = false);
    faq.open = nextState;
  }

  getAccordionHeight(faq: FAQ): string {
    // Return approximate height based on character length to ensure transitions work smoothly without layout jumping
    const baseHeight = 50;
    const lines = Math.ceil(faq.answer.length / 55);
    return `${baseHeight + lines * 22}px`;
  }
}
