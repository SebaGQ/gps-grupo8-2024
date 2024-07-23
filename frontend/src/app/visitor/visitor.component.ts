// visitor-list.component.ts
import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../services/visitor.service';
import { VisitorDTO } from '../dto/visitor.dto';
import { VisitorFormDialogComponent } from './visitor-form-dialog/visitor-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit {
  visitors: VisitorDTO[] = [];
  filteredVisitors: VisitorDTO[] = [];
  showCompleted: boolean = false;


  constructor(private visitorService: VisitorService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getActiveVisitors();
  }

  getActiveVisitors() {
    this.visitorService.getActiveVisitors().subscribe(data => {
      this.visitors = data;
      this.filteredVisitors = data;
    });
  }

  getCompletedVisitors() {
    this.visitorService.getVisitors().subscribe(data => {
      this.visitors = data.filter(visitor => !this.isExitDate9999(visitor.exitDate));
      this.filteredVisitors = this.visitors;
    });
  }

  toggleCompletedVisitors() {
    this.showCompleted = !this.showCompleted;
    if (this.showCompleted) {
      this.getCompletedVisitors();
    } else {
      this.getActiveVisitors();
    }
  }

  openDialog(visitor?: VisitorDTO) {
    const dialogRef = this.dialog.open(VisitorFormDialogComponent, {
      data: visitor || undefined
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getActiveVisitors();
    });
  }

  registerExit(visitorId: string) {
    this.visitorService.registerExit(visitorId).subscribe(
      () => {
        this.getActiveVisitors();
      },
      error => {
        console.error('Error registering exit for visitor', error);
      }
    );
  }


  deleteVisitor(visitorId: string) {
    this.visitorService.deleteVisitor(visitorId).subscribe(
      () => {
        this.getActiveVisitors();
      },
      error => {
        console.error('Error deleting visitor', error);
      }
    );
  }

  isExitDate9999(exitDate: string | Date): boolean {
    return new Date(exitDate).getFullYear() === 9999;
  }

  filterByDate(event: any) {
    const selectedDate = new Date(event.target.value);
    this.visitors = this.visitors.filter(visitor => {
      const entryDate = new Date(visitor.entryDate);
      return entryDate.toDateString() === selectedDate.toDateString();
    });
  }
  
}
