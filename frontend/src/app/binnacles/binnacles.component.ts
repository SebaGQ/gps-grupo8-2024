import { Component } from '@angular/core';
import { BinnaclesService } from '../services/binnacles.service';

@Component({
  selector: 'app-binnacles',
  templateUrl: './binnacles.component.html',
  styleUrls: ['./binnacles.component.css']
})
export class BinnaclesComponent {
  selectedDate: string = '';
  binnacles: any[] = [];

  constructor(private binnaclesService: BinnaclesService) {}

  buscar() {
    if (this.selectedDate) {
      this.binnaclesService.getBinnaclesByDate(this.selectedDate).subscribe(
        (data) => {
          this.binnacles = data;
          console.log(this.binnacles);
        },
        (error) => {
          console.error('Error fetching binnacles', error);
        }
      );
    }
  }

  buscarAll() {
    this.binnaclesService.getBinnacles().subscribe(
      (response: any) => {
        this.binnacles = response.data || [];
        console.log(this.binnacles);
      },
      (error) => {
        console.error('Error fetching binnacles', error);
      }
    );
  }
}
