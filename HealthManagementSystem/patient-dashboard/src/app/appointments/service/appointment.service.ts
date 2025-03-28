import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = 'http://localhost:5000/api/appointments';

  constructor(private http: HttpClient) {}

  getByPatient(patientId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/by-patient/${patientId}`);
  }

  create(appointment: any) {
    return this.http.post(this.baseUrl, appointment);
  }

  update(id: number, appointment: any) {
    return this.http.put(`${this.baseUrl}/${id}`, appointment);
  }
}
