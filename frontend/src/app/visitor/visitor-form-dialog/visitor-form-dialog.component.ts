// visitor-form-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitorService } from '../../services/visitor.service';
import { DepartmentService } from '../../services/department.service';
import { VisitorDTO, DepartmentDTO } from '../../dto/visitor.dto';

@Component({
  selector: 'app-visitor-form-dialog',
  templateUrl: './visitor-form-dialog.component.html',
  styleUrls: ['./visitor-form-dialog.component.css']
})
export class VisitorFormDialogComponent implements OnInit {
  visitor: VisitorDTO;
  departments: DepartmentDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<VisitorFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisitorDTO,
    private visitorService: VisitorService,
    private departmentService: DepartmentService
  ) {
    this.visitor = data ? { ...data } : {
      name: '',
      lastName: '',
      rut: '',
      departmentNumber: { _id: '', departmentNumber: 0, residentId: { _id: '', firstName: '', lastName: '', email: '', rut: '', password: '' } },
      entryDate: new Date(),
      exitDate: new Date('9999-12-31')
    };
  }

  ngOnInit() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  onSubmit() {
    const { _id, name, lastName, rut, departmentNumber, entryDate, exitDate } = this.visitor;
    // Creando un objeto separado para enviar a la API
    const visitorToSubmit = {
      name,
      lastName,
      rut,
      departmentNumber: departmentNumber._id,  // Aquí estamos extrayendo solo el _id como string
      entryDate,
      exitDate
    };

    if (_id) {
      this.visitorService.updateVisitor(_id, visitorToSubmit).subscribe(() => {
        this.dialogRef.close();
      });
    } else {
      this.visitorService.createVisitor(visitorToSubmit).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

}
