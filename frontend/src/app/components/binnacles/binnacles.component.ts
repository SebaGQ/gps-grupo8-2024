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
  searchType: string = 'date';
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
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

}
