import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDTO } from '../dto/user.dto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'auth';
  private authState = new BehaviorSubject<boolean>(this.isAuthenticated());
  private userRole: string | null = null;

  constructor(private httpService: HttpService) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.httpService.post<any>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          const decodedToken: any = jwtDecode(response.data.accessToken);
          const role = decodedToken.roles && decodedToken.roles[0] ? decodedToken.roles[0].name : null;
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('role', role); // Store role
          this.userRole = response.data.role;
          this.authState.next(true); // Emitir nuevo estado de autenticación
        })
      );
  }

  register(user: UserDTO): Observable<any> {
    return this.httpService.post<any>(`${this.authUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role'); // Remove role
    this.userRole = null;
    this.authState.next(false); // Emitir nuevo estado de autenticación
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    if (!this.userRole) {
      this.userRole = localStorage.getItem('role');
    }
    return this.userRole;
  }

  //por si acaso sirve de una
  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isJanitor(): boolean {
    return this.getRole() === 'janitor';
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Devuelve true si el token existe
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  // Método para obtener los roles del usuario desde el token
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decodedToken: any = jwtDecode(token);
    return decodedToken.roles ? decodedToken.roles.map((role: any) => role.name) : [];
  }

  // Método para verificar si el usuario tiene rol de Administrador o Janitor
  isAdminOrJanitor(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('admin') || roles.includes('janitor');
  }




  //Metodos creados por Cristobal para foro de avisos.
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = this.parseJwt(token);
      return decoded?._id || null;
    }
    return null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = this.parseJwt(token);
      return decoded?.roles?.[0]?.name || null;
    }
    return null;
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

}

