import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PrescriptionService } from '../../prescriptions/service/prescription.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-patient-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.scss']
})
export class PatientHomeComponent implements OnInit {
  private prescriptionService = inject(PrescriptionService);
  private authService = inject(AuthService);

  prescriptions: any[] = [];

  ngOnInit(): void {
    const patientMail = this.authService.getUser();
    this.prescriptionService.getByPatientEmail(patientMail).subscribe(res => {
      this.prescriptions = res;
    });
  }
}
