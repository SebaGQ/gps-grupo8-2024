import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../../services/department.service'
import { DepartmentDTO } from '../../dto/department.dto';
import { DepartmentFormDialogComponent } from '../department-form-dialog/department-form-dialog.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: DepartmentDTO[] = [];

  constructor(private departmentService: DepartmentService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }


  openDialog(department?: DepartmentDTO) {
    const dialogRef = this.dialog.open(DepartmentFormDialogComponent, {
      data: department || undefined
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getDepartments();
    });
  }

  deleteDepartment(departmentId: string) {
    this.departmentService.deleteDepartment(departmentId).subscribe(
      () => {
        this.getDepartments();
      },
      error => {
        console.error('Error deleting department', error);
      }
    );
  }
}
