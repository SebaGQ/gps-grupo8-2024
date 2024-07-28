import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentDTO } from 'src/app/dto/department.dto';
import { UserService } from 'src/app/services/user.service';
import { UserDTO } from 'src/app/dto/user.dto';
import { SpaceService } from 'src/app/services/space.service';
import { CommonSpaceDto } from 'src/app/dto/space.dto';

@Component({
  selector: 'app-binnacle-form-dialog',
  templateUrl: './binnacle-form-dialog.component.html',
  styleUrls: ['./binnacle-form-dialog.component.css']
})
export class BinnacleFormDialog implements OnInit {
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
  ) {}

  ngOnInit(): void {
    console.log("Cargando departamentos");
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

    if (this.data.binnacle) {
      this.loadBinnacleData(this.data.binnacle);
    }

    // Suscripción al cambio de valor de activityType
    this.binnacleForm.get('activityType')?.valueChanges.subscribe(value => {
      this.updateFormValidations();
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  loadSpaces(): void {
    this.spaceService.getCommonSpaces().subscribe(data => {
      this.spaces = data;
    });
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

    // Inicializar validaciones basadas en el tipo de actividad
    this.updateFormValidations();
    console.log('Formulario creado:', this.binnacleForm);
  }

  updateFormValidations() {
    const activityType = this.binnacleForm.get('activityType')?.value;
    if (activityType === 'Visita') {
      this.binnacleForm.controls['name'].setValidators([Validators.required]);
      this.binnacleForm.controls['lastName'].setValidators([Validators.required]);
      this.binnacleForm.controls['rut'].setValidators([Validators.required]);
      this.binnacleForm.controls['entryDate'].setValidators([Validators.required]);
      this.binnacleForm.controls['exitDate'].setValidators([Validators.required]);
      this.binnacleForm.controls['roles'].setValidators([Validators.required]);
      this.binnacleForm.controls['departNumber'].setValidators([Validators.required]);
      this.removeUnusedControls(['spaceId', 'recipientFirstName', 'recipientLastName', 'deliveryPersonName', 'deliveryTime', 'status', 'startTime', 'endTime', 'userId']);
    } else if (activityType === 'Espacio Comunitario') {
      this.binnacleForm.controls['spaceId'].setValidators([Validators.required]);
      this.binnacleForm.controls['startTime'].setValidators([Validators.required]);
      this.binnacleForm.controls['endTime'].setValidators([Validators.required]);
      this.binnacleForm.controls['userId'].setValidators([Validators.required]);
      this.removeUnusedControls(['recipientFirstName', 'recipientLastName', 'deliveryPersonName', 'deliveryTime', 'status', 'departNumber', 'rut', 'name', 'lastName', 'entryDate', 'exitDate']);
    } else if (activityType === 'Delivery') {
      this.binnacleForm.controls['departNumber'].setValidators([Validators.required]);
      this.binnacleForm.controls['recipientFirstName'].setValidators([Validators.required]);
      this.binnacleForm.controls['recipientLastName'].setValidators([Validators.required]);
      this.binnacleForm.controls['deliveryPersonName'].setValidators([Validators.required]);
      this.binnacleForm.controls['deliveryTime'].setValidators([Validators.required]);
      this.binnacleForm.controls['status'].setValidators([Validators.required]);
      this.removeUnusedControls(['spaceId', 'startTime', 'endTime', 'name', 'lastName', 'entryDate', 'exitDate', 'rut', 'roles', 'userId']);
    }
    // Actualizar el estado de los controles para aplicar las validaciones
    this.binnacleForm.updateValueAndValidity();
  }

  private removeUnusedControls(controls: string[]) {
    controls.forEach(control => {
      if (this.binnacleForm.contains(control)) {
        this.binnacleForm.removeControl(control);
      }
    });
  }

  loadBinnacleData(binnacle: any): void {
    const activityType = binnacle.activityType;
    this.binnacleForm.patchValue({
      activityType: activityType
    });

    if (activityType === 'Visita') {
      this.binnacleForm.patchValue({
        name: binnacle.name,
        lastName: binnacle.lastName,
        rut: binnacle.rut,
        entryDate: binnacle.entryDate,
        exitDate: binnacle.exitDate,
        roles: binnacle.roles,
        departNumber: binnacle.departmentNumber
      });
    } else if (activityType === 'Espacio Comunitario') {
      this.binnacleForm.patchValue({
        spaceId: binnacle.spaceId,
        startTime: binnacle.startTime,
        endTime: binnacle.endTime,
        userId: binnacle.userId
      });
    } else if (activityType === 'Delivery') {
      this.binnacleForm.patchValue({
        departNumber: binnacle.departmentNumber,
        recipientFirstName: binnacle.recipientFirstName,
        recipientLastName: binnacle.recipientLastName,
        deliveryPersonName: binnacle.deliveryPersonName,
        deliveryTime: binnacle.deliveryTime,
        status: binnacle.status
      });
    }
  }
}
