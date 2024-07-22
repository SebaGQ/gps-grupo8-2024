import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingsComponent } from './admin-bookings.component';

describe('AdminBookingsComponent', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBookingsComponent]
    });
    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
