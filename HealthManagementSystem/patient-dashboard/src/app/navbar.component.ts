import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar} from '@angular/material/toolbar';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatToolbar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  constructor(public auth: AuthService, private router: Router) {}
  isAdmin = false;
  isDoctor = false;
  isPatient = false;
  
  ngOnInit() {
    const roles = this.auth.getUserRoles();
    this.isAdmin = roles.includes('Admin');
    this.isDoctor = roles.includes('Doctor');
    this.isPatient = roles.includes('Patient');
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  getRole(): string[] | null {
    return this.auth.getUserRoles();
  }
}
