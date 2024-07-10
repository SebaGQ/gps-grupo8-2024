import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { BinnacleDTO } from '../dto/binnacle.dto';
import { BinnacleVisitorDTO } from '../dto/binnacleVisitor.dto';
import { BinnacleSpacesDTO } from '../dto/binnacleSpaces.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BinnaclesService {

  private binnacleUrl = 'binnacles'; // Asegúrate de que la URL sea correcta

  constructor(private HttpService: HttpService) { }

  getBinnaclesByDate(date: string): Observable<BinnacleSpacesDTO[] | BinnacleVisitorDTO[]> {
    return this.HttpService.get<{data: BinnacleSpacesDTO[] | BinnacleVisitorDTO[]}>(`${this.binnacleUrl}/date/${date}`).pipe(map(response=>response.data));
  }

  getBinnaclesByVisitor(): Observable<BinnacleVisitorDTO[]> {
    return this.HttpService.get<{data: BinnacleVisitorDTO[]}>(`${this.binnacleUrl}/visitor`).pipe(map(response=>response.data));
  }

  getBinnaclesBySpace(): Observable<BinnacleSpacesDTO[]> {
    return this.HttpService.get<{data: BinnacleSpacesDTO[]}>(`${this.binnacleUrl}/booking`).pipe(map(response=>response.data));
  }
  // getBinnacles(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/getAll`);
  // }
}