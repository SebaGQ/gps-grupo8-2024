import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { BookingDto } from '../dto/booking.dto';
import { CommonSpaceDto } from '../dto/space.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['startTime', 'endTime', 'spaceName', 'actions'];
  dataSource: MatTableDataSource<BookingDto> = new MatTableDataSource();
  bookings: BookingDto[] = [];
  spaces: CommonSpaceDto[] = [];
  userId: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookingsAndSpaces();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBookingsAndSpaces(): void {
    this.bookingService.getMyBookings().subscribe(bookings => {
      this.bookings = bookings.filter(booking => new Date(booking.startTime) >= new Date());
      this.dataSource.data = this.bookings;
    });

    this.bookingService.getSpaces().subscribe(spaces => {
      this.spaces = spaces;
      this.dataSource.filterPredicate = this.customFilterPredicate();
    });
  }

  getSpaceName(spaceId: string): string {
    const space = this.spaces.find(s => s._id === spaceId);
    return space ? space.location : 'Desconocido';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  customFilterPredicate() {
    return (data: BookingDto, filter: string): boolean => {
      const spaceName = this.getSpaceName(data.spaceId).toLowerCase();
      const searchText = filter.toLowerCase();
      return data.startTime.toString().toLowerCase().includes(searchText) ||
             data.endTime.toString().toLowerCase().includes(searchText) ||
             spaceName.includes(searchText);
    };
  }

  deleteBooking(bookingId: string) {
    this.bookingService.deleteBooking(bookingId).subscribe(() => {
      this.loadBookingsAndSpaces();
      this.snackBar.open('Reserva eliminada correctamente', 'Cerrar', {
        duration: 3000
      });
    }, error => {
      this.snackBar.open('Error al eliminar la reserva', 'Cerrar', {
        duration: 3000
      });
    });
  }

  editBooking(booking: BookingDto) {
    this.router.navigate(['/booking', booking.spaceId, { bookingId: booking._id }]);
  }
}
