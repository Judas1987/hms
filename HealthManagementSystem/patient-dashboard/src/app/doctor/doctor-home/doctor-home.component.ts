import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../appointments/service/appointment.service';

@Component({
  selector: 'app-doctor-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.scss']
})
export class DoctorHomeComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  appointments: any[] = [];

  ngOnInit(): void {
    this.appointmentService.getByCurrentDoctor().subscribe(res => {
      this.appointments = res;
    });
  }
}
