import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDTO } from '../dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'users';

  constructor(private httpService: HttpService) {}

  getUsers(): Observable<UserDTO[]> {
    return this.httpService.get<{ state: string, data: UserDTO[] }>(`${this.userUrl}/`).pipe(
      map(response => response.data)
    );
  }

  getUserById(id: string): Observable<UserDTO> {
    return this.httpService.get<{ state: string, data: UserDTO }>(`${this.userUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getUsersByDepartment(): Observable<UserDTO[]> {
    return this.httpService.get<{ state: string, data: UserDTO[] }>(`${this.userUrl}/department`).pipe(
      map(response => response.data)
    );
  }

  getUsersByDepartmentNumberInput(departmentNumber: number): Observable<UserDTO[]> {
    return this.httpService.get<UserDTO[]>(`${this.userUrl}/department/${departmentNumber}`);
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.httpService.post<{ state: string, data: UserDTO }>(`${this.userUrl}/`, user).pipe(
      map(response => response.data)
    );
  }

  updateUser(id: string, user: UserDTO): Observable<UserDTO> {
    return this.httpService.put<{ state: string, data: UserDTO }>(`${this.userUrl}/${id}`, user).pipe(
      map(response => response.data)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.userUrl}/${id}`);
  }
}
