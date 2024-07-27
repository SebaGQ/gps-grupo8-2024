import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../../services/department.service'
import { DepartmentDTO } from '../../dto/department.dto';
import { DepartmentFormDialogComponent } from '../department-form-dialog/department-form-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/app/dto/user.dto';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departments: DepartmentDTO[] = [];

  constructor(
    private departmentService: DepartmentService,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;

      // Cargar los nombres de los residentes
      this.departments.forEach(department => {
        if (department.residentId) {
          this.loadResidentName(department);
        } else {
          department.residentName = 'No asignado';
        }
      });
    });
  }

  loadResidentName(department: DepartmentDTO): void {
    if (department.residentId && typeof department.residentId === 'object' && '_id' in department.residentId) {
      const residentIdString = (department.residentId as any)._id.toString();
      console.log(residentIdString);
      
      this.userService.getUserById(residentIdString).subscribe(
        (user: UserDTO) => {
          department.residentName = `${user.firstName} ${user.lastName}`;
        },
        error => {
          console.error(`Error fetching user with ID ${residentIdString}:`, error);
          department.residentName = 'Error al cargar';
        }
      );
    } else {
      console.error('Invalid residentId format:', department.residentId);
      department.residentName = 'Formato de residente no válido';
    }
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
