import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {  Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { DepartmentDTO } from '../dto/department.dto';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departmentUrl = 'department'; // Endpoint base

  constructor(private httpService: HttpService) {}

  getDepartments(): Observable<DepartmentDTO[]> {
    return this.httpService.get<{ data: DepartmentDTO[] }>(`${this.departmentUrl}/`).pipe(
      map(response => response.data)
    );
  }

  getDepartmentById(id: string): Observable<DepartmentDTO> {
    return this.httpService.get<{ data: DepartmentDTO }>(`${this.departmentUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createDepartment(department: Partial<DepartmentDTO>): Observable<DepartmentDTO> {
    return this.httpService.post<{ data: DepartmentDTO }>(`${this.departmentUrl}/`, department).pipe(
      map(response => response.data)
    );
  }

  updateDepartment(id: string, department: Partial<DepartmentDTO>): Observable<DepartmentDTO> {
    return this.httpService.put<{ data: DepartmentDTO }>(`${this.departmentUrl}/${id}`, department).pipe(
      map(response => response.data)
    );
  }


  deleteDepartment(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.departmentUrl}/${id}`);
  }
}


