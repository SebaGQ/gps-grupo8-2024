import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentFormDialogComponent } from './department-form-dialog.component';

describe('DepartmentFormDialogComponent', () => {
  let component: DepartmentFormDialogComponent;
  let fixture: ComponentFixture<DepartmentFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentFormDialogComponent]
    });
    fixture = TestBed.createComponent(DepartmentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
