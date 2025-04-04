import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  isDarkMode = false;

  isAdmin = false;
  isDoctor = false;
  isPatient = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.setRoles(); // inicial al cargar

    this.auth.getLoginStatus().subscribe(() => {
      this.setRoles(); // actualizar cuando el usuario cambia
    });
  }
  private setRoles() {
    const roles = this.auth.getUserRoles();
    this.isAdmin = roles.includes('Admin');
    this.isDoctor = roles.includes('Doctor');
    this.isPatient = roles.includes('Patient');
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const body = document.body;
  
    if (this.isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
  

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
