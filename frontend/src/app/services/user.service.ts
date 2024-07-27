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
      map(response => response.data)
    );
  }
}