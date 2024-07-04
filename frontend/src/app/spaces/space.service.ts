import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonSpaceDto } from '../dto/space.dto'; // Importa el DTO

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  private apiUrl = 'http://localhost:1313/api/commonSpaces'; // URL de la API

  constructor(private http: HttpClient) { }

  getCommonSpaces(): Observable<CommonSpaceDto[]> {
    return this.http.get<{ state: string, data: CommonSpaceDto[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  createCommonSpace(space: CommonSpaceDto): Observable<CommonSpaceDto> {
    return this.http.post<CommonSpaceDto>(this.apiUrl, space);
  }

  updateCommonSpace(id: string, space: CommonSpaceDto): Observable<CommonSpaceDto> {
    return this.http.put<CommonSpaceDto>(`${this.apiUrl}/${id}`, space);
  }

  deleteCommonSpace(id: string): Observable<CommonSpaceDto> {
    return this.http.delete<CommonSpaceDto>(`${this.apiUrl}/${id}`);
  }
}
