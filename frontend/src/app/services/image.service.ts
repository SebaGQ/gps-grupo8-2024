import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageUrl = 'images'; // Cambia esto a la URL de tu API

  constructor(private httpService: HttpService) {}

  uploadImage(imageData: { name: string, imageData: string }): Observable<{ _id: string, data: { _id: string } }> {
    return this.httpService.post<{ _id: string, data: { _id: string } }>(`${this.imageUrl}`, imageData);
  }
}
