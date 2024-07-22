import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReactionsService {
  private apiUrl = 'http://localhost:80/api/avisos';

  constructor(private http: HttpClient) { }

  likePost(avisoId: string, token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${avisoId}/like`, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }

  dislikePost(avisoId: string, token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${avisoId}/dislike`, {}, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    });
  }
}
