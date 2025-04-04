import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service'; // adjust path if needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
})
export class LoginComponent {
  hide = true;
  form!: FormGroup;

  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;
    this.auth.login(this.form.value.email, this.form.value.password).subscribe({
      next: (res) => {
        this.auth.storeToken(res.token);
        this.auth.notifyLoginChange();
        const roles = this.auth.getUserRoles();
        if (roles.includes('Admin')) this.router.navigate(['/patients']);
        else if (roles.includes('Doctor')) this.router.navigate(['/doctor']);
        else if (roles.includes('Patient')) this.router.navigate(['/patient']);
        else this.router.navigate(['/access-denied']);
      },
      error: () => {
        this.error = 'Invalid credentials';
      },
    });
  }
}
