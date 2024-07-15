// src/app/components/avisos-list/avisos-list.component.ts

import { Component, OnInit } from '@angular/core';
import { AvisosService } from 'src/app/services/avisos.service';
import { Aviso } from 'src/app/models/avisos.models';

@Component({
  selector: 'app-avisos-list',
  templateUrl: './avisos-list.component.html',
  styleUrls: ['./avisos-list.component.css']
})
export class AvisosListComponent implements OnInit {
  avisos: Aviso[] = [];

  constructor(private avisosService: AvisosService) { }

  ngOnInit(): void {
    this.loadAvisos();
  }

  loadAvisos(): void {
    this.avisosService.getAvisos().subscribe((data: Aviso[]) => {
      this.avisos = data;
    }, error => {
      console.error('Error fetching avisos', error);
    });
  }
}
