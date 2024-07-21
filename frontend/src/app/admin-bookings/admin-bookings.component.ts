import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BookingService } from '../services/booking.service';
import { SpaceService } from '../services/space.service';
import { BookingDto } from '../dto/booking.dto';
import { CommonSpaceDto } from '../dto/space.dto';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit, AfterViewInit {
  filterForm: FormGroup;
  displayedColumns: string[] = ['startTime', 'endTime', 'spaceId', 'userId'];
  dataSource: MatTableDataSource<BookingDto> = new MatTableDataSource();
  spaces: CommonSpaceDto[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private spaceService: SpaceService
  ) {
    this.filterForm = this.fb.group({
      date: [''],
      spaceId: [''],
      userId: ['']
    });
  }

  ngOnInit(): void {
    this.loadSpaces();
    this.loadAllBookings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSpaces(): void {
    this.spaceService.getCommonSpaces().subscribe(spaces => {
      this.spaces = spaces;
    });
  }

  loadAllBookings(): void {
    this.bookingService.getAllBookings().subscribe(bookings => {
      this.dataSource.data = bookings;
    });
  }

  filterBookings(): void {
    const date = this.filterForm.value.date;
    const spaceId = this.filterForm.value.spaceId;
    const userId = this.filterForm.value.userId;

    if (date) {
      this.bookingService.getBookingsByDate(date).subscribe(bookings => {
        this.dataSource.data = bookings;
      });
    } else if (spaceId) {
      this.bookingService.getBookingsBySpace(spaceId).subscribe(bookings => {
        this.dataSource.data = bookings;
      });
    } else if (userId) {
      this.bookingService.getBookingsByUser(userId).subscribe(bookings => {
        this.dataSource.data = bookings;
      });
    } else {
      this.loadAllBookings();
    }
  }

  getSpaceName(spaceId: string): string {
    const space = this.spaces.find(s => s._id === spaceId);
    return space ? space.location : 'Desconocido';
  }
}
