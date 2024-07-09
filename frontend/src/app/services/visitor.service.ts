// visitor.service.ts
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VisitorDTO } from '../dto/visitor.dto';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private visitorUrl = 'visitor';

  constructor(private httpService: HttpService) {}

  getVisitors(): Observable<VisitorDTO[]> {
    return this.httpService.get<{ data: VisitorDTO[] }>(`${this.visitorUrl}/`).pipe(
      map(response => response.data)
    );
  }

  getVisitorById(id: string): Observable<VisitorDTO> {
    return this.httpService.get<{ data: VisitorDTO }>(`${this.visitorUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getVisitorsByDepartmentNumber(departmentNumber: number): Observable<VisitorDTO[]> {
    return this.httpService.get<{ data: VisitorDTO[] }>(`${this.visitorUrl}/by-department/${departmentNumber}`).pipe(
      map(response => response.data)
    );
  }

  createVisitor(visitor: Partial<Omit<VisitorDTO, 'departmentNumber'>> & { departmentNumber: string }): Observable<VisitorDTO> {
    return this.httpService.post<{ data: VisitorDTO }>(`${this.visitorUrl}/`, visitor).pipe(
      map(response => response.data)
    );
  }

  updateVisitor(id: string, visitor: Partial<Omit<VisitorDTO, 'departmentNumber'>> & { departmentNumber: string }): Observable<VisitorDTO> {
    return this.httpService.put<{ data: VisitorDTO }>(`${this.visitorUrl}/${id}`, visitor).pipe(
      map(response => response.data)
    );
  }

  deleteVisitor(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.visitorUrl}/${id}`);
  }

  registerExit(visitorId: string): Observable<VisitorDTO> {
    return this.httpService.put<{ data: VisitorDTO }>(`${this.visitorUrl}/${visitorId}/exit-date`, { exitDate: new Date() }).pipe(
      map(response => response.data)
    );
  }
}
