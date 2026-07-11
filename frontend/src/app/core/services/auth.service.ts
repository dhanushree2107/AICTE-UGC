import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private currentRole = '';
  private username = '';

  constructor() {
    // Restore session if available
    const savedRole = localStorage.getItem('user_role');
    const savedUser = localStorage.getItem('username');
    if (savedRole && savedUser) {
      this.loggedIn = true;
      this.currentRole = savedRole;
      this.username = savedUser;
    }
  }

  login(role: string, username?: string) {
    this.loggedIn = true;
    this.currentRole = role;
    
    if (username) {
      this.username = username;
    } else {
      // Assign generic usernames
      if (role === 'ROLE_SUPER_ADMIN') this.username = 'superadmin';
      else if (role === 'ROLE_AICTE_ADMIN') this.username = 'aicteadmin';
      else if (role === 'ROLE_COLLEGE_ADMIN') this.username = 'collegeadmin';
      else if (role === 'ROLE_REVIEWER') this.username = 'reviewer';
      else this.username = 'guest_user';
    }

    localStorage.setItem('user_role', this.currentRole);
    localStorage.setItem('username', this.username);
  }

  logout() {
    this.loggedIn = false;
    this.currentRole = '';
    this.username = '';
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUserName(): string {
    return this.username;
  }

  getRole(): string {
    return this.currentRole;
  }

  getRoleName(): string {
    if (!this.currentRole) return 'Visitor';
    return this.currentRole.replace('ROLE_', '').replace('_', ' ');
  }

  hasRole(role: string): boolean {
    return this.currentRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.currentRole);
  }

  getRegisteredUsers(): any[] {
    const list = localStorage.getItem('registered_users');
    return list ? JSON.parse(list) : [];
  }

  registerUser(user: any) {
    const users = this.getRegisteredUsers();
    // Prevent duplicate usernames
    if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) {
      throw new Error("Username is already registered.");
    }
    users.push(user);
    localStorage.setItem('registered_users', JSON.stringify(users));
  }

  validateCredentials(username: string, password: string): string {
    const userLower = username.trim().toLowerCase();
    const pass = password.trim();

    // 1. Check pre-seeded default users
    if (pass === 'password') {
      if (userLower === 'superadmin') return 'ROLE_SUPER_ADMIN';
      if (userLower === 'aicteadmin') return 'ROLE_AICTE_ADMIN';
      if (userLower === 'collegeadmin') return 'ROLE_COLLEGE_ADMIN';
      if (userLower === 'reviewer') return 'ROLE_REVIEWER';
    }

    // 2. Check locally registered users
    const users = this.getRegisteredUsers();
    const found = users.find(u => u.username.toLowerCase() === userLower && u.password === pass);
    if (found) {
      return found.role;
    }

    return '';
  }
}
