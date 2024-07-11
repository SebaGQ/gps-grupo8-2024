// space.service.ts
import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';
import { CommonSpaceDto } from '../dto/space.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private spaceUrl = 'commonSpaces'; // Cambia esto a la URL de tu API

  constructor(private httpService: HttpService) {}

  getCommonSpaces(): Observable<CommonSpaceDto[]> {
    return this.httpService.get<{ state: string, data: CommonSpaceDto[] }>(`${this.spaceUrl}/`).pipe(
      map(response => response.data)
    );
  }

  getCommonSpaceById(id: string): Observable<CommonSpaceDto> {
    return this.httpService.get<{ state: string, data: CommonSpaceDto }>(`${this.spaceUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCommonSpace(space: CommonSpaceDto): Observable<CommonSpaceDto> {
    return this.httpService.post<CommonSpaceDto>(`${this.spaceUrl}/`, space);
  }

  updateCommonSpace(id: string, space: CommonSpaceDto): Observable<CommonSpaceDto> {
    return this.httpService.put<CommonSpaceDto>(`${this.spaceUrl}/${id}`, space);
  }

  deleteCommonSpace(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.spaceUrl}/${id}`);
  }
}
