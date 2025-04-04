import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'patients',
    component: PatientListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Doctor', 'Admin'] },
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: 'patients/:id',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Doctor'] },
    loadComponent: () =>
      import('./patients/patient-details/patient-details.component').then(
        (m) => m.PatientDetailsComponent,
      ),
  },
  {
    path: 'doctor',
    loadComponent: () =>
      import('./doctor/doctor-home/doctor-home.component').then(
        (m) => m.DoctorHomeComponent,
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Doctor'] },
  },
  {
    path: 'patient',
    loadComponent: () =>
      import('./patients/patient-home/patient-home.component').then(
        (m) => m.PatientHomeComponent,
      ),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Patient'] },
  },
];
