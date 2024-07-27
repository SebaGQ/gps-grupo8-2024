import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDTO } from '../../dto/user.dto';
import { DepartmentDTO } from '../../dto/department.dto';
import { UserService } from '../../services/user.service';
import { RoleService } from 'src/app/services/role.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.css'],
})
export class UserFormDialogComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] | undefined;
  departments: DepartmentDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private departmentService: DepartmentService,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', Validators.required],
      roles: [[], Validators.required],
      password: ['', Validators.required],
      departmentId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }

    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles.map((role) => role.name);
    });

    this.departmentService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      // Exclude departmentId from user data
      const { departmentId, ...userDataWithoutDepartmentId } = userData;

      if (this.data && this.data._id) {
        // Update user
        this.userService.updateUser(this.data._id, userDataWithoutDepartmentId).subscribe(() => {
          this.dialogRef.close(true);

          // Update department if departmentId is provided
          if (departmentId) {
            this.updateDepartmentWithUser(departmentId, this.data._id);
          }
        });
      } else {
        // Create new user
        console.log(userDataWithoutDepartmentId)
        this.userService.createUser(userDataWithoutDepartmentId).subscribe((newUser) => {
          this.dialogRef.close(true);

          // Update department with the newly created user's ID
          if (departmentId) {
            console.log(departmentId)
            this.updateDepartmentWithUser(departmentId, newUser._id);
          }
        });
      }
    }
  }

  private updateDepartmentWithUser(departmentId: string, userId: string): void {
    this.departmentService.getDepartmentById(departmentId).subscribe(department => {
      if (department) {
        // Suponiendo que userService tiene un método para obtener un usuario por su ID
        this.userService.getUserById(userId).subscribe(user => {
          if (user) {
            const departmentUpdateData: Partial<DepartmentDTO> = {
              departmentNumber: department.departmentNumber,
              residentId: user // Aquí se asigna el objeto UserDTO completo
            };
  
             console.log(departmentUpdateData);
            this.departmentService.updateDepartment(departmentId, departmentUpdateData).subscribe(() => {
              console.log(`Department ${departmentId} updated with residentId ${userId}`);
            }, error => {
              console.error('Error updating department:', error);
            });
          }
        }, error => {
          console.error('Error fetching user:', error);
        });
      }
    }, error => {
      console.error('Error fetching department:', error);
    });
  }
  
  
  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
