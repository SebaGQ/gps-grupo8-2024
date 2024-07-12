import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Aviso } from 'src/app/models/avisos.models';
import { AuthService } from 'src/app/services/auth.service';
import { AvisosService } from 'src/app/services/avisos.service';

@Component({
  selector: 'app-avisos-form',
  templateUrl: './avisos-form.component.html',
  styleUrls: ['./avisos-form.component.css']
})
export class AvisosFormComponent implements OnInit {
  avisoForm: FormGroup;
  avisoId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private avisosService: AvisosService,
    private authService: AuthService
  ) {
    this.avisoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.avisoId = this.route.snapshot.paramMap.get('id');
    if (this.avisoId) {
      this.avisosService.getAvisoById(this.avisoId).subscribe((data: Aviso) => {
        this.avisoForm.patchValue(data);
      });

    }

  }

  onSubmit(): void {
    if (this.avisoForm.valid) {
      const avisoData: Aviso = this.avisoForm.value;
      if (this.avisoId) {
        this.avisosService.updateAviso(this.avisoId, avisoData).subscribe(
          response => {
            console.log('Aviso actualizado', response);
            this.router.navigate(['/avisos']);
          },
          error => {
            console.error('Error al actualizar aviso', error);
          }
        );
      } else {
        this.avisosService.createAviso(this.avisoForm.value).subscribe(
          response => {
            console.log('Aviso creado', response);
            this.router.navigate(['/avisos']);
          },
          error => {
            console.error('Error al crear aviso', error);
          }
        )
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/avisos']);
  }
}
