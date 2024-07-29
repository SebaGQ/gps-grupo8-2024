// visitor-form-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitorService } from '../../services/visitor.service';
import { DepartmentService } from '../../services/department.service';
import { VisitorDTO } from '../../dto/visitor.dto';
import { DepartmentDTO } from 'src/app/dto/department.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-visitor-form-dialog',
  templateUrl: './visitor-form-dialog.component.html',
  styleUrls: ['./visitor-form-dialog.component.css']
})
export class VisitorFormDialogComponent implements OnInit {
  visitorForm: FormGroup;
  departments: DepartmentDTO[] = [];
  frequentVisitors: VisitorDTO[] = [];
  filteredFrequentVisitors$: Observable<VisitorDTO[]>;

  private rutSubject = new BehaviorSubject<string>('');

  constructor(
    public dialogRef: MatDialogRef<VisitorFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisitorDTO,
    private visitorService: VisitorService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.visitorForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      rut: ['', [Validators.required, Validators.pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/)]],
      departmentNumber: ['', Validators.required]
    });

    this.filteredFrequentVisitors$ = this.rutSubject.pipe(
      startWith(''),
      switchMap(value => this.filterFrequentVisitors(value))
    );

  }

  ngOnInit() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });

    this.visitorService.getFrequentVisitors().subscribe(data => {
      this.frequentVisitors = data;
    });

    if (this.data) {
      this.visitorForm.patchValue({
        name: this.data.name,
        lastName: this.data.lastName,
        rut: this.data.rut,
        departmentNumber: this.data.departmentNumber._id
      });
    }

    this.visitorForm.get('rut')?.valueChanges.subscribe(value => {
      this.rutSubject.next(value);
    });
  }
  
    private filterFrequentVisitors(value: string): Observable<VisitorDTO[]> {
      const filterValue = value.toLowerCase();
      return new Observable(observer => {
        const filteredVisitors = this.frequentVisitors.filter(visitor => visitor.rut.toLowerCase().includes(filterValue));
        observer.next(filteredVisitors);
        observer.complete();
      });
    }

    onOptionSelected(event: any) {
      const selectedRut = event.option.value;
      const visitor = this.frequentVisitors.find(v => v.rut === selectedRut);
      if (visitor) {
        this.visitorForm.patchValue({
          name: visitor.name,
          lastName: visitor.lastName,
          departmentNumber: visitor.departmentNumber._id
        });
      }
    }

  onSubmit() {
    if (this.visitorForm.valid) {
      const visitorData = this.visitorForm.value;
      const visitorToSubmit = {
        name: visitorData.name,
        lastName: visitorData.lastName,
        rut: visitorData.rut,
        departmentNumber: visitorData.departmentNumber,
        entryDate: new Date(),
        exitDate: new Date('9999-12-31')
      };

      if (this.data && this.data._id) {
        this.visitorService.updateVisitor(this.data._id, visitorToSubmit).subscribe(
          () => {
            this.snackBar.open('Visitante Modificado Corrrectamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close();
          },
          error => {
            this.handleError(error);
          }
        );
      } else {
        this.visitorService.createVisitor(visitorToSubmit).subscribe(
          () => {
            this.snackBar.open('Visitante Registrado Correctamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close();
          },
          error => {
            this.handleError(error);
          }
        );
      }

    }
    
  }

  private handleError(error: any) {
    const errorMessage = error.error?.message || 'Error al Registrar Visitante';
    this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


