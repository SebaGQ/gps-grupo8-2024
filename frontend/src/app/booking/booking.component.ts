import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { SpaceService } from '../services/space.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingDto } from '../dto/booking.dto';
import { CommonSpaceDto } from '../dto/space.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  bookings: BookingDto[] = [];
  space: CommonSpaceDto | null = null;
  spaceId: string | null = null;
  userId: string | null = null;
  isEditMode: boolean = false;
  bookingId: string | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private spaceService: SpaceService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.spaceId = this.route.snapshot.paramMap.get('id');
    this.bookingId = this.route.snapshot.paramMap.get('bookingId');

    if (this.spaceId) {
      this.spaceService.getCommonSpaceById(this.spaceId).subscribe(space => {
        this.space = space;
      });

      this.bookingService.getBookingsBySpace(this.spaceId).subscribe(bookings => {
        this.bookings = bookings;
      });
    }

    if (this.bookingId) {
      this.isEditMode = true;
      this.bookingService.getBookingById(this.bookingId).subscribe(booking => {
        this.bookingForm.patchValue({
          startDate: new Date(booking.startTime),
          startTime: new Date(booking.startTime).toTimeString().slice(0, 5),
          endDate: new Date(booking.endTime),
          endTime: new Date(booking.endTime).toTimeString().slice(0, 5)
        });
        this.spaceId = booking.spaceId;
      });
    }
  }

  createOrUpdateBooking(): void {
    if (this.bookingForm.valid && this.spaceId) {
      const startDate = this.bookingForm.value.startDate;
      const startTime = this.bookingForm.value.startTime;
      const endDate = this.bookingForm.value.endDate;
      const endTime = this.bookingForm.value.endTime;

      const startDateTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        parseInt(startTime.split(':')[0], 10),
        parseInt(startTime.split(':')[1], 10)
      );

      const endDateTime = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        parseInt(endTime.split(':')[0], 10),
        parseInt(endTime.split(':')[1], 10)
      );

      const bookingData: BookingDto = {
        startTime: startDateTime,
        endTime: endDateTime,
        spaceId: this.spaceId,
      };

      if (this.isEditMode && this.bookingId) {
        this.bookingService.updateBooking(this.bookingId, bookingData).subscribe(
          () => {
            this.snackBar.open('Reserva actualizada correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/my-bookings']);
          },
          error => {
            this.snackBar.open('Error al actualizar la reserva', 'Cerrar', {
              duration: 3000
            });
          }
        );
      } else {
        this.bookingService.createBooking(bookingData).subscribe(
          () => {
            this.snackBar.open('Reserva realizada correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/my-bookings']);
          },
          error => {
            this.snackBar.open('Error al realizar la reserva', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}
