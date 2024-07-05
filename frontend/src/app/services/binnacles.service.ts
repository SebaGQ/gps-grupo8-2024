import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { BinnacleDTO } from '../dto/binnacle.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BinnaclesService {

  private binnacleUrl = 'binnacles'; // Asegúrate de que la URL sea correcta

  constructor(private HttpService: HttpService) { }

  getBinnaclesByDate(date: string): Observable<BinnacleDTO[]> {
    return this.HttpService.get<{data: BinnacleDTO[]}>(`${this.binnacleUrl}/date/${date}`).pipe(map(response=>response.data));
  }

  // getBinnacles(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/getAll`);
  // }
}