import { Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Usa el servicio HTTP personalizado
import { Observable } from 'rxjs';
import { BookingDto } from '../dto/booking.dto'; 
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingUrl = 'bookings'; // Cambia esto a la URL de tu API

  constructor(private httpService: HttpService) {}

  getAllBookings(): Observable<BookingDto[]> {
    return this.httpService.get<{ state: string, data: BookingDto[] }>(`${this.bookingUrl}/`).pipe(
      map(response => response.data)
    );
  }

  getBookingById(id: string): Observable<BookingDto> {
    return this.httpService.get<{ state: string, data: BookingDto }>(`${this.bookingUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  createBooking(booking: BookingDto): Observable<BookingDto> {
    return this.httpService.post<BookingDto>(`${this.bookingUrl}/`, booking);
  }

  updateBooking(id: string, booking: BookingDto): Observable<BookingDto> {
    return this.httpService.put<BookingDto>(`${this.bookingUrl}/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.httpService.delete<void>(`${this.bookingUrl}/${id}`);
  }

  getBookingsByUser(userId: string): Observable<BookingDto[]> {
    return this.httpService.get<{ state: string, data: BookingDto[] }>(`${this.bookingUrl}/user/${userId}`).pipe(
      map(response => response.data)
    );
  }

  getBookingsBySpace(spaceId: string): Observable<BookingDto[]> {
    return this.httpService.get<{ state: string, data: BookingDto[] }>(`${this.bookingUrl}/space/${spaceId}`).pipe(
      map(response => response.data)
    );
  }

  getBookingsByDate(date: string): Observable<BookingDto[]> {
    return this.httpService.get<{ state: string, data: BookingDto[] }>(`${this.bookingUrl}/date/${date}`).pipe(
      map(response => response.data)
    );
  }
}
