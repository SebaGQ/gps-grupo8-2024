// http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:80/api';

  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: { headers?: HttpHeaders, params?: HttpParams, context?: HttpContext }): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${url}`, options);
  }

  post<T>(url: string, body: any, options?: { headers?: HttpHeaders, params?: HttpParams, context?: HttpContext }): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${url}`, body, options);
  }

  put<T>(url: string, body: any, options?: { headers?: HttpHeaders, params?: HttpParams, context?: HttpContext }): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${url}`, body, options);
  }

  delete<T>(url: string, options?: { headers?: HttpHeaders, params?: HttpParams, context?: HttpContext }): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${url}`, options);
  }
}
