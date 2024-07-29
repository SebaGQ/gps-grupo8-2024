import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { BinnacleDTO } from '../dto/binnacle.dto';
import { BinnacleVisitorDTO } from '../dto/binnacleVisitor.dto';
import { BinnacleSpacesDTO } from '../dto/binnacleSpaces.dto';
import { BinnacleDeliveryDTO } from '../dto/binnacleDelivery.dto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BinnaclesService {

  private binnacleUrl = 'binnacles'; // Asegúrate de que la URL sea correcta

  constructor(private HttpService: HttpService) { }

  getBinnaclesByDate(date: string): Observable<BinnacleSpacesDTO[] | BinnacleVisitorDTO[] | BinnacleDeliveryDTO[]> {
    return this.HttpService.get<{data: BinnacleSpacesDTO[] | BinnacleVisitorDTO[]}>(`${this.binnacleUrl}/date/${date}`).pipe(map(response=>response.data));
  }

  getBinnaclesByVisitor(): Observable<BinnacleVisitorDTO[]> {
    return this.HttpService.get<{data: BinnacleVisitorDTO[]}>(`${this.binnacleUrl}/visitor`).pipe(map(response=>response.data));
  }

  getBinnaclesBySpace(): Observable<BinnacleSpacesDTO[]> {
    return this.HttpService.get<{data: BinnacleSpacesDTO[]}>(`${this.binnacleUrl}/booking`).pipe(map(response=>response.data));
  }
  
  getBinnacleByJanitor(name: string): Observable<BinnacleDTO[] | BinnacleVisitorDTO[] | BinnacleSpacesDTO[]> {
    return this.HttpService.get<{data: BinnacleDTO[] | BinnacleVisitorDTO[] | BinnacleSpacesDTO[]}>(`${this.binnacleUrl}/id/${name}`).pipe(map(response => response.data));
  }

  getAllBinnacles(): Observable<BinnacleDTO[] | BinnacleVisitorDTO[] | BinnacleSpacesDTO[]> {
    return this.HttpService.get<{data: BinnacleDTO[] | BinnacleVisitorDTO[] | BinnacleSpacesDTO[] }>(`${this.binnacleUrl}/getAll`).pipe(map(response => response.data));
  }
  
  getBinnaclesByDelivery(): Observable<BinnacleDeliveryDTO[]> {
    return this.HttpService.get<{data: BinnacleDeliveryDTO[]}>(`${this.binnacleUrl}/delivery`).pipe(map(response => response.data));
  }

  getBinnacleById(id: string): Observable<BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO | BinnacleDeliveryDTO> {
    return this.HttpService.get<{data: BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO | BinnacleDeliveryDTO}>(`${this.binnacleUrl}/bi/${id}`).pipe(map(response => response.data));
  }

  getBinnacleExcel(): Observable<Blob> {
    return this.HttpService.get<Blob>(`${this.binnacleUrl}/excel`);
  }

  deleteBinnacle(id: string): Observable<any> {
    return this.HttpService.delete<any>(`${this.binnacleUrl}/${id}`);
  }

  updateBinnacle(id: string, data: (BinnacleDTO | BinnacleDeliveryDTO | BinnacleSpacesDTO | BinnacleVisitorDTO)[]): Observable<any> {
    return this.HttpService.put<any>(`${this.binnacleUrl}/${id}`, data);
  }

  createEntryVisitor(data: BinnacleVisitorDTO): Observable<any> {
    return this.HttpService.post<any>(`${this.binnacleUrl}/EntryVisitor`, data);
  }
  
  createEntryBooking(data: BinnacleSpacesDTO): Observable<any> {
    return this.HttpService.post<any>(`${this.binnacleUrl}/EntryBooking`, data);
  }

  createEntryDelivery(data: BinnacleDeliveryDTO): Observable<any> {
    return this.HttpService.post<any>(`${this.binnacleUrl}/EntryDelivery`, data);
  }
}
