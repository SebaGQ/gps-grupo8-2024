import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { BookingDto } from '../dto/booking.dto'; // Crear un DTO similar al `CommonSpaceDto`

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {
  bookings: BookingDto[] = [];
  userId: string | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.userId = this.authService.getUserId(); // Suponiendo que tienes un método para obtener el ID del usuario

    if (this.userId) {
      this.bookingService.getBookingsByUser(this.userId).subscribe(bookings => {
        this.bookings = bookings;
      });
    }
  }
}
