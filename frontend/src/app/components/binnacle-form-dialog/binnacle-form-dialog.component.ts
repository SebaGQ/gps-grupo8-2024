// import { Component, Inject, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'binnacle-form-dialog',
//   templateUrl: './binnacle-form-dialog.component.html',
//   styleUrls: ['./binnacle-form-dialog.component.css']
// })
// export class BinnacleFormDialog implements OnInit {
//   binnacleForm: FormGroup = new FormGroup({});

//   constructor(
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<BinnacleFormDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit(): void {
//     this.createForm();
//     if (this.data.binnacle) {
//       this.binnacleForm.patchValue(this.data.binnacle); // Cargar datos en el formulario
//     }
//   }



//   onSubmit() {
//     console.log('onSubmit called'); 
//     if (this.binnacleForm.valid) {
//       // Mostrar los valores del formulario en la consola
//       // console.log('Form Value:', this.binnacleForm.value);

//       // Cerrar el diálogo y devolver los valores del formulario
//       this.dialogRef.close(this.binnacleForm.value);
//     } else {
//       // Mostrar un mensaje de error o validación
//       console.log('Form is not valid');
//       // Mostrar el estado de cada campo del formulario
//       Object.keys(this.binnacleForm.controls).forEach(key => {
//         console.log(key, this.binnacleForm.get(key)?.valid);
//       });
//     }
//   }

//   onCancel(): void {
//     console.log('Dialog closed');
//     this.dialogRef.close();
//   }

//   showNotification(message: string, action: string) {
//     console.log('Notification:', message); 
//     this.snackBar.open(message, action, {
//       duration: 5000, // Duración en milisegundos
//     });
//   }
// }


import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-binnacle-form-dialog',
  templateUrl: './binnacle-form-dialog.component.html',
  styleUrls: ['./binnacle-form-dialog.component.css']
})
export class BinnacleFormDialog {
  binnacleForm: FormGroup;
  activities: string[] = ['Visita', 'Espacio Comunitario', 'Delivery'];

  constructor(
    public dialogRef: MatDialogRef<BinnacleFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.binnacleForm = this.fb.group({
      activityType: [data.activityType, Validators.required],
      spaceId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.binnacleForm.valid) {
      this.dialogRef.close(this.binnacleForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // createForm() {
  //   switch (this.data.activityType) {
  //     case 'Visita':
  //       this.binnacleForm = this.fb.group({
  //         activityType: [this.data.activityType || '', Validators.required],
  //         name: ['', Validators.required],
  //         lastName: ['', Validators.required],
  //         rut: ['', Validators.required],
  //         rol: ['6688839bf7e5944d1aea6278'],
  //         departmentNumber: ['', Validators.required],
  //       });
  //       break;
  //     case 'Espacio Comunitario':
  //       this.binnacleForm = this.fb.group({
  //         activityType: [this.data.activityType || '', Validators.required],
  //         spaceId: ['', Validators.required],
  //         startTime: ['', Validators.required],
  //         endTime: ['', Validators.required]
  //       });
  //       break;
  //     case 'Delivery':
  //       this.binnacleForm = this.fb.group({
  //         activityType: [this.data.activityType || '', Validators.required],
  //         departNumber: ['', Validators.required],
  //         recipientFirstName: ['', Validators.required],
  //         recipientLastName: ['', Validators.required],
  //         deliveryPersonName: ['', Validators.required],
  //         deliveryTime: ['', Validators.required],
  //         status: ['', Validators.required]
  //       });
  //       break;
  //     default:
  //       this.binnacleForm = this.fb.group({
  //         activityType: [this.data.activityType || '', Validators.required]
  //       });
  //       break;
  //   }
  // }
}
