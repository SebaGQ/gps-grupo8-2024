import { Component, OnInit } from '@angular/core';
import { SpaceService } from './space.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css']
})
export class SpacesComponent implements OnInit {
  spaces$: Observable<any[]> | undefined; // Usaremos un Observable aquí para manejar los datos de forma reactiva

  constructor(private spaceService: SpaceService) { }

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getCommonSpaces(); // Obtener los espacios disponibles
    this.spaces$.subscribe(spaces => console.log(spaces)); // Imprimir los espacios en la consola
  }
}
