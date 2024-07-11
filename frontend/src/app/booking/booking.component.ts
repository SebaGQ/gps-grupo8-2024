import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingDto } from '../dto/booking.dto'; // Crear un DTO similar al `CommonSpaceDto`

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookings: BookingDto[] = [];
  spaceId: string | null = null;
  userId: string | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.spaceId = this.route.snapshot.paramMap.get('id');
    // this.userId = this.authService.getUserId(); // Suponiendo que tienes un método para obtener el ID del usuario

    if (this.spaceId) {
      this.bookingService.getBookingsBySpace(this.spaceId).subscribe(bookings => {
        this.bookings = bookings;
      });
    }
  }

  createBooking(): void {
    if (this.bookingForm.valid && this.spaceId && this.userId) {
      const bookingData: BookingDto = {
        ...this.bookingForm.value,
        spaceId: this.spaceId,
        userId: this.userId
      };
      this.bookingService.createBooking(bookingData).subscribe(() => {
        this.bookingService.getBookingsBySpace(this.spaceId!).subscribe(bookings => {
          this.bookings = bookings;
        });
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
