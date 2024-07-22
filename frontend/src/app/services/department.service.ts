// department.service.ts
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DepartmentDTO } from '../dto/visitor.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departmentUrl = 'department';

  constructor(private httpService: HttpService) {}

  getDepartments(): Observable<DepartmentDTO[]> {
    return this.httpService.get<{ data: DepartmentDTO[] }>(`${this.departmentUrl}/`).pipe(
      map(response => response.data)
    );
  }
}

