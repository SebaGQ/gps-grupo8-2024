
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Aviso } from 'src/app/models/avisos.models';
import { AvisosService } from 'src/app/services/avisos.service';
import { AuthService } from 'src/app/services/auth.service';

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
      const avisoData: Partial<Aviso> = this.avisoForm.value;


      if (this.avisoId) {
        // Actualizar aviso
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
        // Crear aviso
        const token = this.authService.getToken();
        if (token) {
          this.avisosService.createAviso(avisoData, token).subscribe(
            response => {
              console.log('Aviso creado', response);
              this.router.navigate(['/avisos']);
            },
            error => {
              console.error('Error al crear aviso', error);
            }
          );
        } else {
          console.error('No se pudo obtener el token de autenticación');
          // Puedes manejar este caso mostrando un mensaje al usuario, redirigiéndolo a login, etc.
        }
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/avisos']);
  }
}