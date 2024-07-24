import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private apiUrl = 'http://localhost:80/api/avisos';

  constructor(private http: HttpClient) { }

  likePost(avisoId: string, token: string, userId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/${avisoId}/like`, { userId }, { headers });
  }

  dislikePost(avisoId: string, token: string, userId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/${avisoId}/dislike`, { userId }, { headers });
  }
}
