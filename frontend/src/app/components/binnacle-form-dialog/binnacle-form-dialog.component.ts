import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentDTO } from 'src/app/dto/visitor.dto';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/app/dto/user.dto';
import { SpaceService } from 'src/app/services/space.service';
import { CommonSpaceDto } from 'src/app/dto/space.dto';

@Component({
  selector: 'app-binnacle-form-dialog',
  templateUrl: './binnacle-form-dialog.component.html',
  styleUrls: ['./binnacle-form-dialog.component.css']
})
export class BinnacleFormDialog {
  binnacleForm: FormGroup = new FormGroup({});
  activities: string[] = ['Visita', 'Espacio Comunitario', 'Delivery'];
  departments: DepartmentDTO[] = [];
  users: UserDTO[] = [];
  spaces: CommonSpaceDto[] = []; 

  constructor(
    public dialogRef: MatDialogRef<BinnacleFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private userService: UserService,
    private spaceService: SpaceService
  ) {

  }

  ngOnInit(): void {
    console.log("Cargnado departamentos");
    console.log("Cargando usuarios");
    console.log("Cargando espacios");
    this.loadDepartments();
    console.log("Departamentos cargados");
    this.loadUsers();
    console.log("Usuarios cargados");
    this.loadSpaces();
    console.log("Espacios cargados");
    console.log("Creando formulario");
    this.createForm();
  }

  loadDepartments(): void {
    console.log("Cargando departamentos");
    this.departmentService.getDepartments().subscribe(data => {
      console.log("Departamentos cargados");
      this.departments = data;
    });
  }

  loadUsers(): void {
    console.log("Cargando usuarios");
    this.userService.getUsers().subscribe(data => {
      console.log("Usuarios cargados");
      this.users = data;
    }
    );
  }

  loadSpaces(): void {
    console.log("Cargando espacios");
    this.spaceService.getCommonSpaces().subscribe(data => {
      console.log("Espacios cargados");
      this.spaces = data;
    }
    );
  }

  onSubmit(): void {
    if (this.binnacleForm.valid) {
      const formData = this.binnacleForm.value;
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.binnacleForm = this.fb.group({
      activityType: [this.data.activityType || '', Validators.required],
      name: [''],
      lastName: [''],
      rut: [''],
      entryDate: [''],
      exitDate: [''],
      roles: [''],
      startTime: [''],
      endTime: [''],
      userId: [''],
      departNumber: [''],
      spaceId: [''],
      recipientFirstName: [''],
      recipientLastName: [''],
      deliveryPersonName: [''],
      deliveryTime: [''],
      status: ['']
    });
    console.log('Formulario creado:', this.binnacleForm);
    if (this.data.activityType === 'Visita') {
      this.binnacleForm.controls['name'], Validators.required;
      this.binnacleForm.controls['lastName'], Validators.required;
      this.binnacleForm.controls['rut'], Validators.required;
      this.binnacleForm.controls['departNumber'], Validators.required;
      this.binnacleForm.controls['entryDate'], Validators.required;
      this.binnacleForm.controls['exitDate'], Validators.required;
      this.binnacleForm.controls['roles'], Validators.required;
      this.removeUnusedControls(['spaceId', 'recipientFirstName', 'recipientLastName', 'deliveryPersonName', 'deliveryTime', 'status', 'startTime', 'endTime', 'userId']);
    } else if (this.data.activityType === 'Espacio Comunitario') {
      this.binnacleForm.controls['spaceId'], Validators.required;
      this.binnacleForm.controls['startTime'], Validators.required;
      this.binnacleForm.controls['endTime'], Validators.required;
      this.binnacleForm.controls['userId'], Validators.required;
      this.removeUnusedControls(['recipientFirstName', 'recipientLastName', 'deliveryPersonName', 'deliveryTime', 'status', 'departNumber', 'rut', 'name', 'lastName', 'entryDate', 'exitDate']);
    } else if (this.data.activityType === 'Delivery') {
      this.binnacleForm.controls['departmentNumber'], Validators.required;
      this.binnacleForm.controls['recipientFirstName'], Validators.required;
      this.binnacleForm.controls['recipientLastName'], Validators.required;
      this.binnacleForm.controls['deliveryPersonName'], Validators.required;
      this.binnacleForm.controls['deliveryTime'], Validators.required;
      this.binnacleForm.controls['status'], Validators.required;
      this.removeUnusedControls(['spaceId', 'startTime', 'endTime', 'name', 'lastName', 'entryDate', 'exitDate', 'rut', 'roles', 'exitDate', 'entryDate', 'userId']);
    }
  }

  private removeUnusedControls(controls: string[]) {
    controls.forEach(control => {
      this.binnacleForm.removeControl(control);
    });
  }
}

