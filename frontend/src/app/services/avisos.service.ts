// src/app/services/avisos.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Aviso } from '../models/avisos.models';

@Injectable({
  providedIn: 'root'
})
export class AvisosService {
  private apiUrl = 'http://181.162.53.94:8080/api/avisos';

  constructor(private http: HttpClient) { }

  getAvisos(): Observable<Aviso[]> {
    return this.http.get<{ data: Aviso[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getAvisoById(id: string): Observable<Aviso> {
    return this.http.get<{ data: Aviso }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createAviso(aviso: Partial<Aviso>, token: string): Observable<Aviso> {
    return this.http.post<Aviso>(this.apiUrl, aviso, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  updateAviso(id: string, aviso: Partial<Aviso>): Observable<Aviso> {
    return this.http.put<Aviso>(`${this.apiUrl}/${id}`, aviso);
  }

  deleteAviso(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
