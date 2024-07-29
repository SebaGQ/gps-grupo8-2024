import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentComponent } from './department.component';

describe('DepartmentComponent', () => {
  let component: DepartmentComponent;
  let fixture: ComponentFixture<DepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentComponent]
    });
    fixture = TestBed.createComponent(DepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
