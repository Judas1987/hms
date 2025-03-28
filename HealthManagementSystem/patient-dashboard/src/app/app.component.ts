import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'patient-dashboard';

  isDarkMode = false;

toggleDarkMode(): void {
  this.isDarkMode = !this.isDarkMode;
  const host = document.querySelector('app-root');
  if (host) {
    host.classList.toggle('dark-mode', this.isDarkMode);
  }
  localStorage.setItem('darkMode', String(this.isDarkMode));
}

ngOnInit(): void {
  const saved = localStorage.getItem('darkMode') === 'true';
  this.isDarkMode = saved;
  if (saved) {
    const host = document.querySelector('app-root');
    if (host) {
      host.classList.add('dark-mode');
    }
  }
}

}
