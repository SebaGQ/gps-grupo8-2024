import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceFormComponent } from './space-form.component';

describe('SpaceFormComponent', () => {
  let component: SpaceFormComponent;
  let fixture: ComponentFixture<SpaceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceFormComponent]
    });
    fixture = TestBed.createComponent(SpaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
