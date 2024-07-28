import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VisitorService } from '../../services/visitor.service';
import { DepartmentService } from '../../services/department.service';
import { VisitorDTO, DepartmentDTO } from '../../dto/visitor.dto';

@Component({
  selector: 'app-visitor-form-dialog',
  templateUrl: './visitor-form-dialog.component.html',
  styleUrls: ['./visitor-form-dialog.component.css']
})
export class VisitorFormDialogComponent implements OnInit {
  @Input() visitor: VisitorDTO = {
    name: '',
    lastName: '',
    rut: '',
    departmentNumber: { _id: '', departmentNumber: 0, residentId: { _id: '', firstName: '', lastName: '', email: '', rut: '', password: '' } },
    entryDate: new Date(),
    exitDate: new Date('9999-12-31')
  };
  @Output() formSubmit = new EventEmitter<void>();
  @Output() formClose = new EventEmitter<void>();

  departments: DepartmentDTO[] = [];

  constructor(
    private visitorService: VisitorService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.departmentService.getDepartments().subscribe(data => {
      this.departments = data;
    });
  }

  onSubmit() {
    const { _id, name, lastName, rut, departmentNumber, entryDate, exitDate } = this.visitor;
    const visitorToSubmit = {
      name,
      lastName,
      rut,
      departmentNumber: departmentNumber._id,
      entryDate,
      exitDate
    };

    if (_id) {
      this.visitorService.updateVisitor(_id, visitorToSubmit).subscribe(() => {
        this.formSubmit.emit();
      });
    } else {
      this.visitorService.createVisitor(visitorToSubmit).subscribe(() => {
        this.formSubmit.emit();
      });
    }
  }

  onClose() {
    this.formClose.emit();
  }
}
