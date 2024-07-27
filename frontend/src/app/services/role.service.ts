import { Injectable } from '@angular/core';
import { HttpService } from './http.service';  // Asegúrate de que HttpService esté correctamente implementado
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleDTO } from '../dto/role.dto';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesUrl = 'role';

  constructor(private httpService: HttpService) {}

  getRoles(): Observable<RoleDTO[]> {
    return this.httpService.get<{ data: RoleDTO[] }>(`${this.rolesUrl}/`).pipe(
      map(response => response.data)
    );
  }
}
