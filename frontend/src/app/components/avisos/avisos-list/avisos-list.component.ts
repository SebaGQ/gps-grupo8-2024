import { Component, OnInit } from '@angular/core';
import { Aviso } from 'src/app/models/avisos.models';
import { AvisosService } from 'src/app/services/avisos.service';

@Component({
  selector: 'app-avisos-list',
  templateUrl: './avisos-list.component.html',
  styleUrls: ['./avisos-list.component.css']
})
export class AvisosListComponent implements OnInit {
  avisos: Aviso[] = [];

  constructor(private avisosServices: AvisosService) { }

  ngOnInit(): void {
    this.getAvisos();
  }

  getAvisos(): void {
    this.avisosServices.getAvisos().subscribe((data: Aviso[]) => {
      this.avisos = data
    });

  }

}
