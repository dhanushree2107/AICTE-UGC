import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="search-container">
      <header class="search-header">
        <h2>Search Approved Institutions</h2>
        <p>Browse official list of AICTE-authorized colleges and approved UG intake capacity.</p>
      </header>

      <!-- Filter Controls Card -->
      <div class="filter-card">
        <div class="search-box">
          <mat-icon class="search-icon">search</mat-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearchChange()" 
            [placeholder]="activePlaceholder" 
          />
        </div>
        <div class="select-box">
          <select [(ngModel)]="selectedState" (change)="onSearchChange()">
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
        </div>
      </div>

      <!-- Result Table / Loader View -->
      <div class="results-table-wrapper">
        <!-- Skeleton Loader -->
        <div *ngIf="loading" class="skeleton-loader">
          <div class="skeleton-row header-skeleton"></div>
          <div class="skeleton-row" *ngFor="let s of [1, 2]"></div>
        </div>

        <table *ngIf="!loading" class="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Institution Name</th>
              <th>State</th>
              <th>District</th>
              <th>Type</th>
              <th>Established</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inst of filteredInstitutes" class="fade-row">
              <td>#{{ inst.id }}</td>
              <td class="col-name">{{ inst.name }}</td>
              <td>{{ inst.state }}</td>
              <td>{{ inst.district }}</td>
              <td><span class="type-badge" [class.govt]="inst.institutionType === 'Govt'">{{ inst.institutionType }}</span></td>
              <td>{{ inst.establishedYear }}</td>
              <td><a [href]="inst.website" target="_blank" class="web-link">{{ inst.website }}</a></td>
            </tr>
            <tr *ngIf="filteredInstitutes.length === 0">
              <td colspan="7" class="no-records">No approved institutions match your query.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .search-header { margin-bottom: 28px; }
    .search-header h2 { font-size: 26px; margin: 0; font-family: var(--font-heading); font-weight: 800; }
    .search-header p { color: var(--text-muted); margin: 6px 0 0 0; font-size: 14px; }

    .filter-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      gap: 16px;
      margin-bottom: 28px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .search-box {
      flex-grow: 1;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 12px;
      color: var(--text-muted);
    }
    .search-box input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px 12px 46px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-color);
      outline: none;
      font-size: 13px;
      transition: border-color 0.2s;
    }
    .search-box input:focus { border-color: var(--primary-color); }

    .select-box select {
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-color);
      outline: none;
      min-width: 180px;
      font-size: 13px;
    }

    .results-table-wrapper {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      min-height: 200px;
    }
    .results-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    .results-table th {
      background-color: var(--border-color);
      padding: 16px;
      font-weight: 600;
    }
    .results-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .col-name { font-weight: 600; }
    .type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
      background-color: #fef3c7;
      color: #d97706;
      text-transform: uppercase;
    }
    .type-badge.govt {
      background-color: #d1fae5;
      color: #059669;
    }
    .web-link {
      text-decoration: none;
      color: var(--primary-color);
      font-weight: 600;
    }
    .web-link:hover { text-decoration: underline; }
    .no-records {
      text-align: center;
      padding: 40px;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Skeleton Loader Styling */
    .skeleton-loader {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .skeleton-row {
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-color) 50%, var(--border-color) 75%);
      background-size: 200% 100%;
      animation: skeleton-shift 1.5s infinite linear;
    }
    .header-skeleton { height: 28px; width: 60%; }

    @keyframes skeleton-shift {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Fade-in Row Animation */
    .fade-row {
      animation: fade-row-anim 0.35s ease both;
    }
    @keyframes fade-row-anim {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {
  searchQuery = '';
  selectedState = '';
  institutes: any[] = [];
  filteredInstitutes: any[] = [];
  loading = false;

  // Dynamic placeholder cycling
  activePlaceholder = 'Search by college name, e.g. MIT...';
  private placeholders = [
    'Search by college name, e.g. MIT...',
    'Search by state, e.g. Maharashtra...',
    'Search by district or city, e.g. Pune...',
    'Search by type, e.g. Govt...'
  ];
  private placeholderIndex = 0;
  private intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInstitutes();
    this.startPlaceholderRotation();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startPlaceholderRotation() {
    this.intervalId = setInterval(() => {
      this.placeholderIndex = (this.placeholderIndex + 1) % this.placeholders.length;
      this.activePlaceholder = this.placeholders[this.placeholderIndex];
    }, 4000);
  }

  loadInstitutes() {
    this.loading = true;
    this.http.get<any[]>('/api/public/approved-institutes').subscribe({
      next: (res) => {
        this.institutes = res;
        this.filteredInstitutes = res;
        this.loading = false;
      },
      error: () => {
        // Fallback demo data
        this.institutes = [
          { id: 1, name: "Maharashtra Institute of Technology", state: "Maharashtra", district: "Pune", institutionType: "Self-Financing", establishedYear: 1983, website: "https://mitpune.edu.in" },
          { id: 2, name: "Delhi Technological University", state: "Delhi", district: "North West Delhi", institutionType: "Govt", establishedYear: 1941, website: "http://www.dtu.ac.in" },
          { id: 3, name: "Karnataka Institute of Technology", state: "Karnataka", district: "Bangalore", institutionType: "Govt", establishedYear: 1996, website: "http://www.kit.edu.in" },
          { id: 4, name: "Tamil Nadu Engineering College", state: "Tamil Nadu", district: "Chennai", institutionType: "Self-Financing", establishedYear: 2004, website: "http://www.tnec.edu" }
        ];
        this.filteredInstitutes = this.institutes;
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    this.loading = true;
    // Simulate query debounce / load state delay for 400ms
    setTimeout(() => {
      this.filterInstitutes();
      this.loading = false;
    }, 450);
  }

  filterInstitutes() {
    this.filteredInstitutes = this.institutes.filter(inst => {
      const matchesSearch = !this.searchQuery || 
        inst.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inst.district.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inst.institutionType.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesState = !this.selectedState || inst.state === this.selectedState;
      
      return matchesSearch && matchesState;
    });
  }
}
