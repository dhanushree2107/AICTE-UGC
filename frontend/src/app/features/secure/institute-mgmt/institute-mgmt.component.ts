import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-institute-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="mgmt-container">
      <header class="mgmt-header">
        <h2>Institutional Profile Management</h2>
        <p>Update college general metadata, faculty profiles, and classroom capacities.</p>
      </header>

      <!-- Tabs Navigation -->
      <div class="tabs-bar">
        <button [class.active]="activeTab === 'general'" (click)="activeTab = 'general'">General Info</button>
        <button [class.active]="activeTab === 'faculty'" (click)="activeTab = 'faculty'">Faculty Profiles</button>
        <button [class.active]="activeTab === 'infrastructure'" (click)="activeTab = 'infrastructure'">Infrastructure</button>
      </div>

      <!-- Tab 1: General Info -->
      <div class="tab-content" *ngIf="activeTab === 'general'">
        <div class="form-card">
          <h3>College General Details</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>College Name</label>
              <input type="text" [(ngModel)]="institute.name" />
            </div>
            <div class="form-group">
              <label>Established Year</label>
              <input type="number" [(ngModel)]="institute.establishedYear" />
            </div>
            <div class="form-group">
              <label>State</label>
              <input type="text" [(ngModel)]="institute.state" />
            </div>
            <div class="form-group">
              <label>District</label>
              <input type="text" [(ngModel)]="institute.district" />
            </div>
            <div class="form-group">
              <label>Contact Email</label>
              <input type="email" [(ngModel)]="institute.email" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" [(ngModel)]="institute.phone" />
            </div>
          </div>
          <button mat-flat-button color="primary" class="save-btn" (click)="saveGeneralInfo()">
            <mat-icon>save</mat-icon> Save Changes
          </button>
        </div>
      </div>

      <!-- Tab 2: Faculty Profile Management -->
      <div class="tab-content" *ngIf="activeTab === 'faculty'">
        <!-- Add Faculty Form -->
        <div class="form-card">
          <h3>Add New Faculty</h3>
          <div class="form-grid-3">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="newFaculty.name" placeholder="Dr. Jane Doe" />
            </div>
            <div class="form-group">
              <label>Designation</label>
              <select [(ngModel)]="newFaculty.designation">
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>
            <div class="form-group">
              <label>Qualification</label>
              <input type="text" [(ngModel)]="newFaculty.qualification" placeholder="e.g. Ph.D. CS" />
            </div>
            <div class="form-group">
              <label>Aadhaar No</label>
              <input type="text" [(ngModel)]="newFaculty.aadhaarNo" placeholder="12-digit number" />
            </div>
            <div class="form-group">
              <label>PAN No</label>
              <input type="text" [(ngModel)]="newFaculty.panNo" placeholder="10-character code" />
            </div>
            <div class="form-group">
              <label>Experience (Years)</label>
              <input type="number" [(ngModel)]="newFaculty.experienceYears" />
            </div>
          </div>
          <button mat-flat-button color="primary" class="save-btn" (click)="addFaculty()">
            <mat-icon>add</mat-icon> Register Faculty
          </button>
        </div>

        <!-- Faculty Directory Table -->
        <div class="results-table-wrapper" style="margin-top: 24px;">
          <table class="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Qualification</th>
                <th>Experience</th>
                <th>Aadhaar</th>
                <th>PAN</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fac of facultyList">
                <td style="font-weight: 600;">{{ fac.name }}</td>
                <td>{{ fac.designation }}</td>
                <td>{{ fac.qualification }}</td>
                <td>{{ fac.experienceYears }} Years</td>
                <td>{{ fac.aadhaarNo }}</td>
                <td>{{ fac.panNo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: Infrastructure details -->
      <div class="tab-content" *ngIf="activeTab === 'infrastructure'">
        <!-- Add Infrastructure Form -->
        <div class="form-card">
          <h3>Add New Room / Lab</h3>
          <div class="form-grid-3">
            <div class="form-group">
              <label>Room Designation / Name</label>
              <input type="text" [(ngModel)]="newRoom.roomType" placeholder="e.g. Computer Lab CL-02" />
            </div>
            <div class="form-group">
              <label>Area (Sq. Meters)</label>
              <input type="number" [(ngModel)]="newRoom.areaSqM" />
            </div>
            <div class="form-group">
              <label>Student Capacity</label>
              <input type="number" [(ngModel)]="newRoom.capacity" />
            </div>
          </div>
          <button mat-flat-button color="primary" class="save-btn" (click)="addInfrastructure()">
            <mat-icon>add</mat-icon> Register Infrastructure
          </button>
        </div>

        <!-- Infrastructure Directory Table -->
        <div class="results-table-wrapper" style="margin-top: 24px;">
          <table class="results-table">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Area (sqm)</th>
                <th>Capacity</th>
                <th>WiFi Enabled</th>
                <th>Projector</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rm of infraList">
                <td style="font-weight: 600;">{{ rm.roomType }}</td>
                <td>{{ rm.areaSqM }} sqm</td>
                <td>{{ rm.capacity }} Students</td>
                <td><mat-icon style="color: green;">check</mat-icon> Yes</td>
                <td><mat-icon style="color: green;">check</mat-icon> Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mgmt-container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .mgmt-header { margin-bottom: 24px; }
    .mgmt-header h2 { font-size: 24px; margin: 0; }
    .mgmt-header p { color: var(--text-muted); margin: 4px 0 0 0; font-size: 14px; }

    .tabs-bar {
      display: flex;
      gap: 12px;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 24px;
    }
    .tabs-bar button {
      background: none;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 3px solid transparent;
      outline: none;
    }
    .tabs-bar button.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .form-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .save-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 8px;
    }

    .results-table-wrapper {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-light);
    }
    .results-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .results-table th {
      background-color: var(--border-color);
      padding: 14px 16px;
      font-weight: 600;
    }
    .results-table td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-color);
    }
  `]
})
export class InstituteMgmtComponent implements OnInit {
  activeTab = 'general';
  
  institute: any = {
    name: "Maharashtra Institute of Technology",
    establishedYear: 1983,
    state: "Maharashtra",
    district: "Pune",
    email: "info@mitpune.edu.in",
    phone: "020-25431791"
  };

  facultyList: any[] = [
    { name: "Dr. Ramesh Kumar", designation: "Professor", qualification: "Ph.D in CS", experienceYears: 22, aadhaarNo: "123456789012", panNo: "ABCDE1234F" },
    { name: "Prof. Sunita Deshmukh", designation: "Associate Professor", qualification: "M.Tech", experienceYears: 12, aadhaarNo: "987654321098", panNo: "XYZWP5678Q" }
  ];

  newFaculty: any = { name: '', designation: 'Professor', qualification: '', experienceYears: 5, aadhaarNo: '', panNo: '' };

  infraList: any[] = [
    { roomType: "Class Room CR-101", areaSqM: 66.5, capacity: 60 },
    { roomType: "Computer Lab CL-01", areaSqM: 120.0, capacity: 40 }
  ];

  newRoom: any = { roomType: '', areaSqM: 66.5, capacity: 60 };

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  saveGeneralInfo() {
    alert("College General Details updated successfully.");
  }

  addFaculty() {
    if (!this.newFaculty.name) return;
    this.facultyList.push({ ...this.newFaculty });
    this.newFaculty = { name: '', designation: 'Professor', qualification: '', experienceYears: 5, aadhaarNo: '', panNo: '' };
    alert("New faculty member registered.");
  }

  addInfrastructure() {
    if (!this.newRoom.roomType) return;
    this.infraList.push({ ...this.newRoom });
    this.newRoom = { roomType: '', areaSqM: 66.5, capacity: 60 };
    alert("Infrastructure room registered.");
  }
}
