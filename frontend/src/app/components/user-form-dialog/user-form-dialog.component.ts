import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDTO } from '../../dto/user.dto';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.css']
})
export class UserFormDialogComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] | undefined

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', Validators.required],
      roles: [[], Validators.required] // Suponiendo que roles es un array
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.userForm.valid) {
      if (this.data) {
        this.userService.updateUser(this.data._id, this.userForm.value).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        this.userService.createUser(this.userForm.value).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
