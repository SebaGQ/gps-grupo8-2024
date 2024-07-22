import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorFormDialogComponent } from './visitor-form-dialog.component';

describe('VisitorFormDialogComponent', () => {
  let component: VisitorFormDialogComponent;
  let fixture: ComponentFixture<VisitorFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitorFormDialogComponent]
    });
    fixture = TestBed.createComponent(VisitorFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
