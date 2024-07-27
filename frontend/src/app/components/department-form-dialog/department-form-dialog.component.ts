import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DepartmentDTO } from '../../dto/department.dto';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department-form-dialog',
  templateUrl: './department-form-dialog.component.html',
  styleUrls: ['./department-form-dialog.component.css']
})
export class DepartmentFormDialogComponent implements OnInit {
  departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    public dialogRef: MatDialogRef<DepartmentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepartmentDTO
  ) {
    this.departmentForm = this.fb.group({
      departmentNumber: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.departmentForm = this.fb.group({
      departmentNumber: [this.data?.departmentNumber || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.departmentForm.valid) {
      const departmentData = this.departmentForm.value;
      if (this.data && this.data._id) {
        this.departmentService.updateDepartment(this.data._id, departmentData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.departmentService.createDepartment(departmentData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
