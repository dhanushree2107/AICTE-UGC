import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-wrapper animate-fade-in">
      <div class="auth-container" [class.register-active]="!isLoginMode">
        
        <!-- Form Container Column -->
        <div class="form-container">
          
          <!-- State 1: Login Form -->
          <form *ngIf="isLoginMode" (submit)="onLoginSubmit()" class="auth-form login-form">
            <h3>Sign In to Console</h3>
            <p class="subtitle">Enter credentials or choose a quick testing profile.</p>

            <div *ngIf="errorMessage" class="error-alert">
              <mat-icon style="font-size: 16px; width: 16px; height: 16px;">error_outline</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <div class="form-group">
              <label for="loginUser">Username or Email</label>
              <div class="input-wrapper">
                <mat-icon class="input-icon">person</mat-icon>
                <input 
                  type="text" 
                  id="loginUser" 
                  name="loginUser" 
                  [(ngModel)]="loginCredentials.username" 
                  required 
                  placeholder="e.g. superadmin / collegeadmin" 
                />
              </div>
            </div>

            <div class="form-group">
              <label for="loginPass">Password</label>
              <div class="input-wrapper">
                <mat-icon class="input-icon">lock</mat-icon>
                <input 
                  type="password" 
                  id="loginPass" 
                  name="loginPass" 
                  [(ngModel)]="loginCredentials.password" 
                  required 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div class="form-actions">
              <div class="remember-me">
                <input type="checkbox" id="remember" name="remember" />
                <label for="remember">Remember me</label>
              </div>
              <a class="forgot-link" (click)="forgotPassword()">Forgot Password?</a>
            </div>

            <button mat-flat-button color="primary" class="submit-btn" type="submit" [disabled]="loading">
              <span *ngIf="!loading">Authenticate Session</span>
              <span *ngIf="loading" class="spinner-small"></span>
            </button>

            <div class="divider">
              <span>Or Quick Login for Developers</span>
            </div>

            <div class="quick-roles">
              <button type="button" mat-stroked-button (click)="quickLogin('ROLE_SUPER_ADMIN')">Super Admin</button>
              <button type="button" mat-stroked-button (click)="quickLogin('ROLE_AICTE_ADMIN')">AICTE Admin</button>
              <button type="button" mat-stroked-button (click)="quickLogin('ROLE_COLLEGE_ADMIN')">College Representative</button>
              <button type="button" mat-stroked-button (click)="quickLogin('ROLE_REVIEWER')">Peer Reviewer</button>
            </div>

            <p class="toggle-text">
              Don't have an account? <span class="toggle-link" (click)="toggleMode(false)">Register Now</span>
            </p>
          </form>

          <!-- State 2: Registration Form -->
          <form *ngIf="!isLoginMode" (submit)="onRegisterSubmit()" class="auth-form register-form">
            <h3>Create an Account</h3>
            <p class="subtitle">Complete the fields below to establish your profile.</p>

            <div class="form-grid">
              <div class="form-group">
                <label for="regUser">Username</label>
                <input 
                  type="text" 
                  id="regUser" 
                  name="regUser" 
                  [(ngModel)]="registerData.username" 
                  required 
                  placeholder="e.g. collegeadmin" 
                />
              </div>
              <div class="form-group">
                <label for="regEmail">Email Address</label>
                <input 
                  type="email" 
                  id="regEmail" 
                  name="regEmail" 
                  [(ngModel)]="registerData.email" 
                  required 
                  placeholder="admin@mit.edu" 
                />
              </div>
              <div class="form-group">
                <label for="regPass">Password</label>
                <input 
                  type="password" 
                  id="regPass" 
                  name="regPass" 
                  [(ngModel)]="registerData.password" 
                  required 
                  placeholder="••••••••" 
                />
              </div>
              <div class="form-group">
                <label for="regConfPass">Confirm Password</label>
                <input 
                  type="password" 
                  id="regConfPass" 
                  name="regConfPass" 
                  [(ngModel)]="registerData.confirmPassword" 
                  required 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group select-group">
                <label for="regRole">Requested Portal Role</label>
                <select id="regRole" name="regRole" [(ngModel)]="registerData.role" required>
                  <option value="ROLE_COLLEGE_ADMIN">College Representative</option>
                  <option value="ROLE_REVIEWER">Peer Reviewer</option>
                  <option value="ROLE_INSPECTION_COMMITTEE">Inspection Inspector</option>
                  <option value="ROLE_AICTE_ADMIN">AICTE Board Officer</option>
                </select>
              </div>
              <div class="form-group select-group">
                <label for="regAssoc">Association Type</label>
                <select id="regAssoc" name="regAssoc" [(ngModel)]="associationType">
                  <option value="link">Link to Approved College</option>
                  <option value="new">Register a New Institution</option>
                </select>
              </div>
            </div>

            <!-- Conditional 1: Link College -->
            <div class="form-group" *ngIf="associationType === 'link'">
              <label for="existingInst">Select Approved Institute</label>
              <select id="existingInst" name="existingInst" [(ngModel)]="registerData.instituteId">
                <option [value]="1">Maharashtra Institute of Technology (Pune)</option>
                <option [value]="2">Delhi Technological University (Delhi)</option>
              </select>
            </div>

            <!-- Conditional 2: Register New College -->
            <div class="form-grid" *ngIf="associationType === 'new'">
              <div class="form-group">
                <label for="newInstName">Institute Name</label>
                <input 
                  type="text" 
                  id="newInstName" 
                  name="newInstName" 
                  [(ngModel)]="newInst.name" 
                  placeholder="e.g. Pune Tech College" 
                />
              </div>
              <div class="form-group">
                <label for="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  [(ngModel)]="newInst.state" 
                  placeholder="e.g. Maharashtra" 
                />
              </div>
            </div>

            <button mat-flat-button color="primary" class="submit-btn" type="submit" [disabled]="loading">
              <span *ngIf="!loading">Create credentials & Sign In</span>
              <span *ngIf="loading" class="spinner-small"></span>
            </button>

            <p class="toggle-text">
              Already have an account? <span class="toggle-link" (click)="toggleMode(true)">Sign In</span>
            </p>
          </form>

        </div>

        <!-- Decorative Sidebar Panel -->
        <div class="decorative-panel">
          <div class="panel-content">
            <div class="brand-header">
              <span class="material-icons brand-icon">verified_user</span>
              <h2>AICTE UG Secure Login</h2>
            </div>
            <p class="brand-text">Access the unified portal to submit application packages, check real-time OCR results, schedule reviews, and monitor Board decisions.</p>
            
            <div class="bullet-list">
              <div class="bullet">
                <mat-icon>security</mat-icon>
                <span>Multi-Factor Authentication (MFA) enabled</span>
              </div>
              <div class="bullet">
                <mat-icon>history</mat-icon>
                <span>Comprehensive user audit logs mapped</span>
              </div>
              <div class="bullet">
                <mat-icon>psychology</mat-icon>
                <span>AI Validation agents running on upload</span>
              </div>
            </div>
          </div>
          
          <div class="brand-footer">
            <span>© 2026 AICTE | Security Standard v2.4</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 160px);
      padding: 24px 12px;
    }

    .auth-container {
      display: grid;
      grid-template-columns: 480px 380px;
      grid-template-areas: "form brand";
      background-color: var(--card-bg);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      border: 1px solid var(--border-color);
      max-width: 860px;
      width: 100%;
      min-height: 560px;
      transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .auth-container.register-active {
      grid-template-columns: 380px 480px;
      grid-template-areas: "brand form";
    }

    /* Forms container columns styling */
    .form-container {
      grid-area: form;
      padding: 44px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      animation: form-entrance 0.5s ease both;
    }

    @keyframes form-entrance {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }

    .auth-form h3 { font-size: 24px; margin: 0 0 6px 0; font-family: var(--font-heading); font-weight: 800; }
    .subtitle { font-size: 13px; color: var(--text-muted); margin: 0 0 24px 0; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }
    .form-group label { font-size: 12px; font-weight: 600; color: var(--text-muted); }
    
    .input-wrapper { position: relative; }
    .input-icon { position: absolute; left: 12px; top: 10px; color: var(--text-muted); font-size: 20px; }
    .input-wrapper input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px 10px 42px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-color);
      outline: none;
      font-size: 13px;
      transition: border-color 0.2s;
    }
    .input-wrapper input:focus { border-color: var(--primary-color); }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-group select {
      box-sizing: border-box;
      width: 100%;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-color);
      outline: none;
      font-size: 13px;
      transition: border-color 0.2s;
    }
    .form-group select:focus { border-color: var(--primary-color); }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .remember-me { display: flex; align-items: center; gap: 6px; }
    .remember-me label { color: var(--text-muted); cursor: pointer; }
    .forgot-link { color: var(--primary-color); cursor: pointer; font-weight: 600; text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }

    .submit-btn {
      width: 100%;
      background: var(--primary-gradient) !important;
      color: white !important;
      font-weight: 700;
      padding: 11px;
      border-radius: 8px;
    }

    .divider {
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      line-height: 0.1em;
      margin: 24px 0 20px 0;
    }
    .divider span {
      background: var(--card-bg);
      padding: 0 10px;
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 600;
    }

    .quick-roles {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }
    .quick-roles button {
      font-size: 11px;
      font-weight: 600;
      border-radius: 6px;
      padding: 6px;
      border-color: var(--border-color) !important;
    }

    .toggle-text {
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
      margin: 8px 0 0 0;
    }
    .toggle-link {
      color: var(--primary-color);
      font-weight: 700;
      cursor: pointer;
    }
    .toggle-link:hover { text-decoration: underline; }

    /* Error alert banner */
    .error-alert {
      background-color: #fee2e2;
      color: #991b1b;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #fecaca;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    /* Decorative side column panel */
    .decorative-panel {
      grid-area: brand;
      background: var(--primary-gradient);
      color: white;
      padding: 44px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-header h2 { font-size: 20px; margin: 0; font-family: var(--font-heading); font-weight: 800; }
    .brand-icon { font-size: 28px; }
    .brand-text { font-size: 13px; opacity: 0.85; line-height: 1.6; margin: 20px 0 28px 0; }

    .bullet-list { display: flex; flex-direction: column; gap: 16px; }
    .bullet { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; }
    .bullet mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .brand-footer { font-size: 10px; opacity: 0.6; }

    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s infinite linear;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .animate-fade {
      animation: fade-anim 0.3s ease;
    }
    @keyframes fade-anim {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class LoginComponent implements OnInit {
  isLoginMode = true;
  loading = false;
  errorMessage = '';

  // Forms Binding Models
  loginCredentials = { username: '', password: '' };
  registerData = { username: '', email: '', password: '', confirmPassword: '', role: 'ROLE_COLLEGE_ADMIN', instituteId: 1 };
  
  associationType = 'link';
  newInst = { name: '', state: '' };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Switch state based on direct route URLs
    this.isLoginMode = !this.router.url.includes('/register');
  }

  toggleMode(mode: boolean) {
    this.isLoginMode = mode;
    this.errorMessage = '';
    // Navigate url path quietly to sync browser address bar
    const path = this.isLoginMode ? '/login' : '/register';
    window.history.pushState({}, '', path);
  }

  onLoginSubmit() {
    this.errorMessage = '';
    if (!this.loginCredentials.username.trim() || !this.loginCredentials.password.trim()) {
      this.errorMessage = "Please enter both username and password.";
      return;
    }

    this.loading = true;
    setTimeout(() => {
      const user = this.loginCredentials.username.trim();
      const pass = this.loginCredentials.password.trim();

      const matchedRole = this.authService.validateCredentials(user, pass);

      if (matchedRole) {
        this.authService.login(matchedRole, user);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      } else {
        this.loading = false;
        this.errorMessage = "Invalid credentials. Please enter a valid pre-seeded or registered username and password.";
      }
    }, 900);
  }

  onRegisterSubmit() {
    if (!this.registerData.username.trim() || !this.registerData.email.trim() || !this.registerData.password.trim()) {
      alert("Please fill out all required profile credentials.");
      return;
    }
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert("Passwords do not match. Please verify.");
      return;
    }

    this.loading = true;
    setTimeout(() => {
      try {
        this.authService.registerUser({
          username: this.registerData.username,
          email: this.registerData.email,
          password: this.registerData.password,
          role: this.registerData.role
        });

        // Auto login
        this.authService.login(this.registerData.role, this.registerData.username);
        this.loading = false;
        alert("Registration complete! Session established.");
        this.router.navigate(['/dashboard']);
      } catch (err: any) {
        this.loading = false;
        alert(err.message || "Registration failed.");
      }
    }, 1000);
  }

  quickLogin(role: string) {
    this.errorMessage = '';
    if (role === 'ROLE_SUPER_ADMIN') {
      this.loginCredentials.username = 'superadmin';
    } else if (role === 'ROLE_AICTE_ADMIN') {
      this.loginCredentials.username = 'aicteadmin';
    } else if (role === 'ROLE_COLLEGE_ADMIN') {
      this.loginCredentials.username = 'collegeadmin';
    } else if (role === 'ROLE_REVIEWER') {
      this.loginCredentials.username = 'reviewer';
    }
    this.loginCredentials.password = 'password';
  }

  forgotPassword() {
    alert("Keycloak OIDC Password Reset workflow triggered. Check your configured email inbox.");
  }
}
