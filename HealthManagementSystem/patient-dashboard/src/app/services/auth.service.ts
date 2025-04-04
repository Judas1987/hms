import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5001/api/auth';

  constructor(private http: HttpClient) {}

  private loggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  notifyLoginChange() {
    this.loggedIn$.next(true);
  }

  getLoginStatus() {
    return this.loggedIn$.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn$.next(false);
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, {
      email,
      password,
    });
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): string {
    const token = this.getToken();
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    const user =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    return user || '';
  }

  getUserRoles() {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      const roles =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (Array.isArray(roles)) return roles;
      if (typeof roles === 'string') return [roles];
      return [];
    } catch {
      return [];
    }
  }
}
