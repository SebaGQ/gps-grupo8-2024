import { Component } from '@angular/core';
import { BinnaclesService } from '../../services/binnacles.service';
import { BinnacleDTO } from 'src/app/dto/binnacle.dto';
import { BinnacleVisitorDTO } from 'src/app/dto/binnacleVisitor.dto';
import { BinnacleSpacesDTO } from 'src/app/dto/binnacleSpaces.dto';

@Component({
  selector: 'app-binnacles',
  templateUrl: './binnacles.component.html',
  styleUrls: ['./binnacles.component.css']
})
export class BinnaclesComponent {
  selectedDate: string = '';
  searchType: string = 'date';
  selectedActivity: string = '';
  formattedBinnacles: any[] = [];
  binnacles: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO)[] = [];
  binnaclesVisitor: BinnacleVisitorDTO[] = [];

  constructor(private binnaclesService: BinnaclesService) {}

  buscar() {
    if (this.selectedDate) {
      this.binnaclesService.getBinnaclesByDate(this.selectedDate).subscribe(
        (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO)[]) => {
          this.binnacles = data;
          this.formatBinnacles();
          console.log('Binnacles', this.binnacles);
        },
        (error) => {
          console.error('Error fetching binnacles', error);
        }
      );
    }
  }

  buscarVisita() {
    this.binnaclesService.getBinnaclesByVisitor().subscribe(
      (data: BinnacleVisitorDTO[]) => {
        this.binnacles = data;
        this.formatBinnacles();
        console.log('BinnaclesVisitor', this.binnacles);
      },
      (error) => {
        console.error('Error fetching binnacles', error);
      }
    );
  }

  buscarEspacio() {
    this.binnaclesService.getBinnaclesBySpace().subscribe(
      (data: BinnacleSpacesDTO[]) => {
        this.binnacles = data;
        this.formatBinnacles();
        console.log('BinnaclesSpaces', this.binnacles);
      },
      (error) => {
        console.error('Error fetching binnacles', error);
      }
    );
  }

  formatBinnacles() {
    this.formattedBinnacles = this.binnacles.map(binnacle => {
      if (binnacle.activityType === 'Visita') {
        // Es BinnacleVisitorDTO
        const visitorBinnacle = binnacle as BinnacleVisitorDTO;
        return {
          janitorID: visitorBinnacle.janitorID,
          activityType: visitorBinnacle.activityType,
          createdAt: visitorBinnacle.createdAt,
          description: `Nombre: ${visitorBinnacle.name} ${visitorBinnacle.lastName}, RUT: ${visitorBinnacle.rut} visita al departamento ${visitorBinnacle.departmentNumber}`
        };
      } else if (binnacle.activityType === 'Espacio Comunitario') {
        // Es BinnacleSpacesDTO
        const spacesBinnacle = binnacle as BinnacleSpacesDTO;
        return {
          janitorID: spacesBinnacle.janitorID,
          activityType: spacesBinnacle.activityType,
          createdAt: spacesBinnacle.createdAt,
          description: `Espacio: ${spacesBinnacle.spaceId}, Inicio: ${this.formatDate(spacesBinnacle.startTime)}, Fin: ${this.formatDate(spacesBinnacle.endTime)}`
        };
      } else {
        return ;
      }
    });
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
