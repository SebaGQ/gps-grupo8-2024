// src/app/interceptors/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInJvbGVzIjpbeyJfaWQiOiI2NjU2YjEyMTBmYzFhNzgxZTBjNjYyMzMiLCJuYW1lIjoiYWRtaW4ifV0sImRlcGFydG1lbnROdW1iZXIiOm51bGwsImlhdCI6MTcxODc3MTU2NywiZXhwIjoxNzE4ODU3OTY3fQ.bZRN2SJN-1Aak9aj1_MdR9EAOehcDebAdQLILLq9SdQ'; // Reemplaza esto con tu token de autenticación

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
