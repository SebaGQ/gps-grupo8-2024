import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Aviso } from 'src/app/models/avisos.models';
import { AvisosService } from 'src/app/services/avisos.service';

@Component({
  selector: 'app-avisos-detail',
  templateUrl: './avisos-detail.component.html',
  styleUrls: ['./avisos-detail.component.css']
})
export class AvisosDetailComponent implements OnInit {
  aviso: Aviso | null = null;


  constructor(
    private route: ActivatedRoute, private avisosServices: AvisosService) { }

  ngOnInit(): void {
    this.getAviso();
  }

  getAviso(): void {
    const avisoId = this.route.snapshot.paramMap.get('id');
    if (avisoId) {
      this.avisosServices.getAvisoById(avisoId).subscribe((response: any) => {
        this.aviso = response.data;
      });

    }

  }

}
