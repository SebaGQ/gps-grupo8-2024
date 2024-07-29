// avisos-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvisosService } from 'src/app/services/avisos.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService, // Inyecta el AuthService aquí
    private toastr: ToastrService
  ) {
    this.avisoForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.avisoId = this.route.snapshot.paramMap.get('id');
    if (this.avisoId) {
      this.avisosService.getAvisoById(this.avisoId).subscribe(aviso => {
        this.avisoForm.patchValue(aviso);
      });
    }
  }

  onSubmit(): void {
    if (this.avisoForm.valid) {
      const avisoData = this.avisoForm.value;
      const token = this.authService.getToken(); // Obtén el token aquí

      if (this.avisoId) {
        this.avisosService.updateAviso(this.avisoId, avisoData).subscribe(
          response => {
            this.toastr.success('Aviso actualizado con éxito');
            this.router.navigate(['/avisos']);
          },
          error => {
            this.toastr.error('Error al actualizar el aviso');
          }
        );
      } else {
        if (token) {
          this.avisosService.createAviso(avisoData, token).subscribe(
            response => {
              this.toastr.success('Aviso creado con éxito');
              this.router.navigate(['/avisos']);
            },
            error => {
              this.toastr.error('Error al crear el aviso');
            }
          );
        } else {
          this.toastr.error('No se pudo obtener el token de autenticación');
        }
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/avisos']);
  }
}
