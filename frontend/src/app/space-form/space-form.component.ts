import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SpaceService } from '../spaces/space.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonSpaceDto } from '../dto/space.dto'; // Importa el DTO
import { MatCheckboxChange } from '@angular/material/checkbox'; // Importa MatCheckboxChange
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.css']
})
export class SpaceFormComponent {

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

  constructor(
    private spaceService: SpaceService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.spaceForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: [0, Validators.required],
      allowedDays: this.fb.array([], Validators.required),
      openingHour: ['', Validators.required],
      closingHour: ['', Validators.required],
      type: ['', Validators.required],
      image: [null]
    });
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    const allowedDays: FormArray = this.spaceForm.get('allowedDays') as FormArray;
    if (event.checked) {
      allowedDays.push(this.fb.control(event.source.value));
      console.log('Día agregado:', event.source.value);
    } else {
      const index = allowedDays.controls.findIndex(x => x.value === event.source.value);
      allowedDays.removeAt(index);
      console.log('Día eliminado:', event.source.value);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0] ?? null;
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.base64Image = e.target.result.split(',')[1];
        console.log('Imagen en Base64:', this.base64Image); // Verifica la conversión a Base64
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
      this.http.post<{ _id: string, data: { _id: string } }>('http://localhost:1313/api/images', imageData)
        .subscribe(
          response => {
            console.log('Imagen guardada:', response);
            console.log('Imagen guardada con ID:', response._id); // Verifica la respuesta del servidor
            resolve(response.data._id);
          },
          error => {
            console.error('Error al guardar la imagen:', error);
            reject(error);
          }
        );
    });
  }

  async createSpace(): Promise<void> {
    if (this.spaceForm.valid) {
      const spaceData: CommonSpaceDto = this.spaceForm.value;
      if (this.selectedFile) {
        try {
          const imageId = await this.uploadImage();
          spaceData.image = imageId;
        } catch (error) {
          console.error('Error al subir la imagen:', error);
          return;
        }
      }
      console.log('Datos enviados al backend:', spaceData); // Verifica los datos antes de enviar
      this.spaceService.createCommonSpace(spaceData).subscribe(() => {
        this.router.navigate(['/spaces']);
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
