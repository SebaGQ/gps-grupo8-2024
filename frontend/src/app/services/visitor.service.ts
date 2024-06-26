// visitor.service.ts
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VisitorDTO } from '../dto/visitor.dto';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private visitorUrl = 'visitor';

  constructor(private httpService: HttpService, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVisitors(): Observable<VisitorDTO[]> {
    return this.httpService.get<{ data: VisitorDTO[] }>(`${this.visitorUrl}/`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  getVisitorById(id: string): Observable<VisitorDTO> {
    return this.httpService.get<{ data: VisitorDTO }>(`${this.visitorUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  getVisitorsByDepartmentNumber(departmentNumber: number): Observable<VisitorDTO[]> {
    return this.httpService.get<{ data: VisitorDTO[] }>(`${this.visitorUrl}/by-department/${departmentNumber}`, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  createVisitor(visitor: VisitorDTO): Observable<VisitorDTO> {
    return this.httpService.post<{ data: VisitorDTO }>(`${this.visitorUrl}/`, visitor, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  updateVisitor(id: string, visitor: VisitorDTO): Observable<VisitorDTO> {
    return this.httpService.put<{ data: VisitorDTO }>(`${this.visitorUrl}/${id}`, visitor, { headers: this.getAuthHeaders() }).pipe(
      map(response => response.data)
    );
  }

  deleteVisitor(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.visitorUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
