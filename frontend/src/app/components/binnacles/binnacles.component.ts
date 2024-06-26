import { Component } from '@angular/core';
import { BinnaclesService } from '../../services/binnacles.service';
import { BinnacleDTO } from 'src/app/dto/binnacle.dto';

@Component({
  selector: 'app-binnacles',
  templateUrl: './binnacles.component.html',
  styleUrls: ['./binnacles.component.css']
})
export class BinnaclesComponent {
  selectedDate: string = '';
  binnacles: BinnacleDTO[] = [];

  constructor(private binnaclesService: BinnaclesService) {}

  buscar() {
    if (this.selectedDate) {
      this.binnaclesService.getBinnaclesByDate(this.selectedDate).subscribe(
        (data: BinnacleDTO[]) => {
          this.binnacles = data;
          console.log('Binnacles',this.binnacles);
        },
        (error) => {
          console.error('Error fetching binnacles', error);
        }
      );
    }
  }

  // buscarAll() {
  //   this.binnaclesService.getBinnacles().subscribe(
  //     (response: any) => {
  //       this.binnacles = response.data || [];
  //       console.log(this.binnacles);
  //     },
  //     (error) => {
  //       console.error('Error fetching binnacles', error);
  //     }
  //   );
  // }
}
