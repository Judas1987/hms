import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = 'http://localhost:5001/api/patients';
  private cache: { [key: string]: { items: any[]; totalCount: number } } = {};

  constructor(private http: HttpClient) {}

  getAll(
    name: string = '',
    page = 1,
    pageSize = 10,
    forceRefresh = false,
  ): Observable<{ items: any[]; totalCount: number }> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    if (name) {
      params = params.set('name', name);
    }

    const cacheKey = `name=${name}|page=${page}|pageSize=${pageSize}`;

    if (!forceRefresh && this.cache[cacheKey]) {
      return of(this.cache[cacheKey]); // retornar del caché
    }

    return this.http
      .get<{ items: any[]; totalCount: number }>(this.baseUrl, { params })
      .pipe(
        delay(3000),
        tap((data) => (this.cache[cacheKey] = data)), // guardar en caché
      );
  }

  clearCache() {
    this.cache = {};
  }

  create(patient: any) {
    this.clearCache();
    return this.http.post(this.baseUrl, patient);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
