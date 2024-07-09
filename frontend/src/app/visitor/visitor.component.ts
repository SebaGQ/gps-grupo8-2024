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


  constructor(private visitorService: VisitorService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchVisitors();
  }

  fetchVisitors() {
    this.visitorService.getVisitors().subscribe(
      (data: VisitorDTO[]) => {
        console.log('Datos recibidos:', data);
        this.visitors = data;
      },
      error => {
        console.error('Error fetching visitors', error);
      }
    );
  }

  openDialog(visitor?: VisitorDTO) {
    const dialogRef = this.dialog.open(VisitorFormDialogComponent, {
      data: visitor || undefined
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchVisitors();
    });
  }

  registerExit(visitorId: string) {
    this.visitorService.registerExit(visitorId).subscribe(
      () => {
        this.fetchVisitors();
      },
      error => {
        console.error('Error registering exit for visitor', error);
      }
    );
  }


  deleteVisitor(visitorId: string) {
    this.visitorService.deleteVisitor(visitorId).subscribe(
      () => {
        this.fetchVisitors();
      },
      error => {
        console.error('Error deleting visitor', error);
      }
    );
  }
  
}
