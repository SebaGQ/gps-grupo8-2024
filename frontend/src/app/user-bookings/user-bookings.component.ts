import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'; // Importar MatSnackBar y MatSnackBarConfig
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { BookingDto } from '../dto/booking.dto';
import { CommonSpaceDto } from '../dto/space.dto';
import { Router } from '@angular/router';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog.component';
; // Asumiendo que tienes un componente de confirmación

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
    private dialog: MatDialog,
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
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        message: '¿Estás seguro de que deseas eliminar esta reserva?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookingService.deleteBooking(bookingId).subscribe(() => {
          this.loadBookingsAndSpaces();
          this.showNotification('Reserva eliminada correctamente', 'Cerrar');
        }, error => {
          this.showNotification('Error al eliminar la reserva', 'Cerrar');
          console.error(`Error eliminando la reserva: ${error.message}`, error);
        });
      }
    });
  }

  editBooking(booking: BookingDto) {
    this.router.navigate(['/booking', booking.spaceId, { bookingId: booking._id }]);
  }

  showNotification(message: string, action: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Duración en milisegundos
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }
}
