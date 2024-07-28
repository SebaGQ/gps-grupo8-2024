import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aviso } from '../models/avisos.models';

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private apiUrl = 'http://localhost:80/api/avisos';

  constructor(private http: HttpClient) { }

  reactToAviso(avisoId: string, reactionType: 'like' | 'dislike', token: string): Observable<Aviso> {
    const url = `${this.apiUrl}/${avisoId}/react`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { reactionType };

    return this.http.post<Aviso>(url, body, { headers });
  }
}
