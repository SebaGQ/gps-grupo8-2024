// visitor-list.component.ts
import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../services/visitor.service';
import { VisitorDTO } from '../dto/visitor.dto';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit {
  visitors: VisitorDTO[] = [];

  constructor(private visitorService: VisitorService) {}

  ngOnInit() {
    this.fetchVisitors();
  }

  fetchVisitors() {
    this.visitorService.getVisitors().subscribe(
      (data: VisitorDTO[]) => {
        console.log('Datos recibidos:', data);
        this.visitors = data;
      },
      error => {
        console.error('Error fetching visitors', error);
      }
    );
  }
}
