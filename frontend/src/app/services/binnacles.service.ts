import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinnaclesService {

  private baseUrl = 'http://localhost:3000/api/binnacles'; // Asegúrate de que la URL sea correcta

  constructor(private http: HttpClient) { }

  getBinnaclesByDate(date: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/date/${date}`);
  }

  getBinnacles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAll`);
  }
}