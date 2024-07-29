import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { SpaceService } from '../services/space.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  filteredBookings: BookingDto[] = [];
  space: CommonSpaceDto | null = null;
  spaceId: string | null = null;
  userId: string | null = null;
  isEditMode: boolean = false;
  bookingId: string | null = null;
  displayedColumns: string[] = ['startTime', 'endTime'];

  constructor(
    private bookingService: BookingService,
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
    }, { validators: this.timeRangeValidator });
  }

  ngOnInit(): void {
    this.spaceId = this.route.snapshot.paramMap.get('id');
    this.bookingId = this.route.snapshot.paramMap.get('bookingId');

    if (this.spaceId) {
      this.spaceService.getCommonSpaceById(this.spaceId).subscribe(space => {
        this.space = space;
      });

      this.bookingService.getBookingsBySpace(this.spaceId).subscribe(bookings => {
        const now = new Date();
        this.bookings = bookings;
        this.filteredBookings = this.bookings.filter(booking => new Date(booking.startTime) >= now);
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
      const startDate = this.bookingForm.value.startDate instanceof Date ? this.bookingForm.value.startDate : new Date(this.bookingForm.value.startDate);
      const startTime = this.bookingForm.value.startTime;
      const endDate = this.bookingForm.value.endDate instanceof Date ? this.bookingForm.value.endDate : new Date(this.bookingForm.value.endDate);
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
            this.snackBar.open(`Error al actualizar la reserva: ${error.error.message || error.message}`, 'Cerrar', {
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
            this.snackBar.open(`Error al realizar la reserva: ${error.error.message || error.message}`, 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    } else {
      this.snackBar.open('Formulario no válido', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('startDate')?.value;
    const startTime = group.get('startTime')?.value;
    const endDate = group.get('endDate')?.value;
    const endTime = group.get('endTime')?.value;

    if (startDate && startTime && endDate && endTime) {
      const startDateTime = new Date(startDate);
      startDateTime.setHours(parseInt(startTime.split(':')[0], 10), parseInt(startTime.split(':')[1], 10));
      const endDateTime = new Date(endDate);
      endDateTime.setHours(parseInt(endTime.split(':')[0], 10), parseInt(endTime.split(':')[1], 10));

      if (endDateTime <= startDateTime) {
        return { endBeforeStart: true };
      }
    }
    return null;
  }

  filterDates = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    const day = date.getDay();
    const allowedDays = this.space?.allowedDays.map(day => this.getDayIndex(day)) || [];
    const now = new Date();

    return allowedDays.includes(day) && date >= now;
  }

  getDayIndex(day: string): number {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days.indexOf(day.toLowerCase());
  }
}
