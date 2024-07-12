import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aviso } from '../models/avisos.models';

@Injectable({
  providedIn: 'root'
})
export class AvisosService {
  private apiUrl = 'http://localhost:80/api/avisos';

  constructor(private http: HttpClient) { }

  createAviso(aviso: Aviso): Observable<Aviso> {
    return this.http.post<Aviso>(this.apiUrl, aviso);
  }

  getAvisos(): Observable<Aviso[]> {
    return this.http.get<Aviso[]>(this.apiUrl);
  }

  getAvisoById(id: string): Observable<Aviso> {
    return this.http.get<Aviso>(`${this.apiUrl}/${id}`);
  }

  updateAviso(id: string, aviso: Aviso): Observable<Aviso> {
    return this.http.put<Aviso>(`${this.apiUrl}/${id}`, aviso);
  }

  deleteAviso(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
