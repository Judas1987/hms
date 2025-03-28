import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = 'http://localhost:5001/api/patients';

  constructor(private http: HttpClient) {}

  getAll(name: string = '', page = 1, pageSize = 10) {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
  
    if (name) params = params.set('name', name);
  
    return this.http.get<{ items: any[]; totalCount: number }>(this.baseUrl, { params });
  }  
  
  getById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }  
}
