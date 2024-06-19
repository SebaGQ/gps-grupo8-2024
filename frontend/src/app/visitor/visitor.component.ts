// src/app/visitor/visitor.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit {
  visitantes$: Observable<any[]> | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarVisitantes();
  }

  cargarVisitantes() {
    this.visitantes$ = this.http.get<any>('http://localhost:80/api/visitor', { withCredentials: true }).pipe(
      map(response => response.data) // Extrae el array de visitantes de la propiedad 'data'
    );
  }
}




