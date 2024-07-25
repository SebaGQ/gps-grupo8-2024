import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaceService } from '../services/space.service';
import { ImageService } from '../services/image.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonSpaceDto } from '../dto/space.dto';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.css']
})
export class SpaceFormComponent implements OnInit {
  spaceForm: FormGroup;
  daysOfWeek = [
    { name: 'Lunes', value: 'monday' },
    { name: 'Martes', value: 'tuesday' },
    { name: 'Miércoles', value: 'wednesday' },
    { name: 'Jueves', value: 'thursday' },
    { name: 'Viernes', value: 'friday' },
    { name: 'Sábado', value: 'saturday' },
    { name: 'Domingo', value: 'sunday' }
  ];
  selectedFile: File | null = null;
  base64Image: string | null = null;
  spaceId: string | null = null;

  constructor(
    private spaceService: SpaceService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.spaceForm = this.fb.group({
      availability: [true, Validators.required],
      location: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(0)]],
      allowedDays: this.fb.array([], Validators.required),
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
      type: ['', Validators.required],
      image: [null]
    }, { validators: this.timeRangeValidator });
  }

  ngOnInit(): void {
    this.spaceId = this.route.snapshot.paramMap.get('id');
    if (this.spaceId) {
      this.spaceService.getCommonSpaceById(this.spaceId).subscribe(space => {
        this.spaceForm.patchValue(space);

        // Limpiar el FormArray antes de agregar nuevos días
        const allowedDays: FormArray = this.spaceForm.get('allowedDays') as FormArray;
        allowedDays.clear();
        space.allowedDays.forEach(day => {
          allowedDays.push(this.fb.control(day));
        });

        if (space.image) {
          this.base64Image = space.image;
        }
      });
    }
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    const allowedDays: FormArray = this.spaceForm.get('allowedDays') as FormArray;
    if (event.checked) {
      allowedDays.push(this.fb.control(event.source.value));
    } else {
      const index = allowedDays.controls.findIndex(x => x.value === event.source.value);
      allowedDays.removeAt(index);
    }

    // Actualizar disponibilidad basado en los días permitidos
    const availability = allowedDays.length > 0;
    this.spaceForm.get('availability')?.setValue(availability);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] ?? null;
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.base64Image = e.target.result.split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.base64Image) {
        reject('No image selected');
        return;
      }
      const imageData = {
        name: this.selectedFile?.name || 'image',
        imageData: this.base64Image
      };
      this.imageService.uploadImage(imageData).subscribe(
        response => {
          resolve(response.data._id);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  async saveSpace(): Promise<void> {
    if (this.spaceForm.valid) {
      const spaceData: CommonSpaceDto = this.spaceForm.value;
      if (this.selectedFile) {
        try {
          const imageId = await this.uploadImage();
          spaceData.image = imageId;
        } catch (error) {
          this.snackBar.open(`Error al subir la imagen: ${error}`, 'Cerrar', {
            duration: 3000
          });
          return;
        }
      }
      if (this.spaceId) {
        this.spaceService.updateCommonSpace(this.spaceId, spaceData).subscribe(
          () => {
            this.snackBar.open('Espacio actualizado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/spaces']);
          },
          error => {
            this.snackBar.open(`Error al actualizar el espacio: ${error.error.message || error.message}`, 'Cerrar', {
              duration: 3000
            });
          }
        );
      } else {
        this.spaceService.createCommonSpace(spaceData).subscribe(
          () => {
            this.snackBar.open('Espacio creado correctamente', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/spaces']);
          },
          error => {
            this.snackBar.open(`Error al crear el espacio: ${error.error.message || error.message}`, 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    } else {
      this.snackBar.open('Formulario no válido', 'Cerrar', {
        duration: 3000
      });
    }
  }

  private timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const openingHour = group.get('openingHour')?.value;
    const closingHour = group.get('closingHour')?.value;

    if (openingHour && closingHour && openingHour >= closingHour) {
      return { endBeforeStart: true };
    }
    return null;
  }
}
