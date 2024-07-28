// user.service.ts
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
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
    return this.httpService.get<{ data: UserDTO[] }>(`${this.userUrl}/`).pipe(
      map(response => response.data.map(user => ({
        ...user,
        roleNames: user.roles?.map(role => role.name).join(', ') || 'No Roles Assigned'
      })))
    );
  }

  getUserById(id: string): Observable<UserDTO> {
    return this.httpService.get<{ data: UserDTO }>(`${this.userUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createUser(user: Partial<UserDTO>): Observable<UserDTO> {
    return this.httpService.post<{ data: UserDTO }>(`${this.userUrl}/`, user).pipe(
      map(response => response.data)
    );
  }

  updateUser(id: string, user: Partial<UserDTO>): Observable<UserDTO> {
    return this.httpService.put<{ data: UserDTO }>(`${this.userUrl}/${id}`, user).pipe(
      map(response => response.data)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.userUrl}/${id}`);
  }
}