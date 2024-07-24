import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDTO } from '../dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'auth';
  private authState = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private httpService: HttpService) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.httpService.post<any>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
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
    this.authState.next(false); // Emitir nuevo estado de autenticación
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Devuelve true si el token existe
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

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

