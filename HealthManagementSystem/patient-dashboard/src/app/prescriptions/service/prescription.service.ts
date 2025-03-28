import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private baseUrl = 'http://localhost:5000/api/prescriptions';

  constructor(private http: HttpClient) {}

  getByPatient(patientId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/by-patient/${patientId}`);
  }

  create(prescription: any) {
    return this.http.post(this.baseUrl, prescription);
  }

  update(id: number, prescription: any) {
    return this.http.put(`${this.baseUrl}/${id}`, prescription);
  }
}
