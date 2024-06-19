import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpaceService } from '../spaces/space.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.css']
})
export class SpaceFormComponent {

  spaceForm: FormGroup;

  constructor(
    private spaceService: SpaceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.spaceForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [0, Validators.required],
      allowedDays: ['', Validators.required],
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  createSpace(): void {
    if (this.spaceForm.valid) {
      this.spaceService.createCommonSpace(this.spaceForm.value).subscribe(() => {
        this.router.navigate(['/spaces']);
      });
    }
  }
}
