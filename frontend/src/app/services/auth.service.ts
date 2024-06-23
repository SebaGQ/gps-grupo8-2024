import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDTO } from '../dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'auth'; // Cambia esto a la URL de tu API

  constructor(private httpService: HttpService) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.httpService.post<any>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
        })
      );
  }

  register(user: UserDTO): Observable<any> {
    return this.httpService.post<any>(`${this.authUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Devuelve true si el token existe
  }
}
