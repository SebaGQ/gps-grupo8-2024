import { Component, ViewChild, AfterViewInit, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BinnaclesService } from '../../services/binnacles.service';
import { AuthService } from '../../services/auth.service';
import { BinnacleDTO } from 'src/app/dto/binnacle.dto';
import { BinnacleVisitorDTO } from 'src/app/dto/binnacleVisitor.dto';
import { BinnacleSpacesDTO } from 'src/app/dto/binnacleSpaces.dto';
import { BinnacleDeliveryDTO } from 'src/app/dto/binnacleDelivery.dto';

@Component({
  selector: 'app-binnacles',
  templateUrl: './binnacles.component.html',
  styleUrls: ['./binnacles.component.css']
})
export class BinnaclesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  isAdmin: boolean = false;
  selectedDate: string = '';
  searchType: string = 'date';
  selectedActivity: string = '';
  janitorName: string = ''; // Variable para almacenar el nombre del conserje
  filterActivity: string = '';
  isModalOpen: boolean = false; // Controlar la visibilidad del modal
  binnacleSeleccionado: any = {}; // Bitácora seleccionada para modificación
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private binnaclesService: BinnaclesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  resetPaginator() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  getPagedData() {
    const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    const endIndex = this.paginator ? (this.paginator.pageIndex + 1) * this.paginator.pageSize : this.dataSource.data.length;
    return this.dataSource.data.slice(startIndex, endIndex);
  }

  buscarFecha() {
    if (this.selectedDate) {
      this.binnaclesService.getBinnaclesByDate(this.selectedDate).subscribe(
        (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO | BinnacleDeliveryDTO)[]) => {
          this.dataSource.data = this.formatBinnacles(data);
          this.resetPaginator();
        },
        (error) => {
          console.error('Error fetching binnacles', error);
        }
      );
    }
  }

  buscarConserje() {
    if (this.janitorName) {
      this.binnaclesService.getBinnacleByJanitor(this.janitorName).subscribe(
        (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO)[]) => {
          this.dataSource.data = this.formatBinnacles(data);
          this.resetPaginator();
        },
        (error) => {
          console.error('Error fetching binnacles', error);
        }
      );
    }
  }

  buscarTodo() {
    this.binnaclesService.getAllBinnacles().subscribe(
      (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO)[]) => {
        this.dataSource.data = this.formatBinnacles(data);
        this.resetPaginator();
      },
      (error) => {
        console.error('Error fetching all binnacles', error);
      }
    );
  }

  buscarVisita() {
    this.binnaclesService.getBinnaclesByVisitor().subscribe(
      (data: BinnacleVisitorDTO[]) => {
        this.dataSource.data = this.formatBinnacles(data);
        this.resetPaginator();
      },
      (error) => {
        console.error('Error fetching binnacles', error);
      }
    );
  }

  buscarEspacio() {
    this.binnaclesService.getBinnaclesBySpace().subscribe(
      (data: BinnacleSpacesDTO[]) => {
        this.dataSource.data = this.formatBinnacles(data);
        this.resetPaginator();
      },
      (error) => {
        console.error('Error fetching binnacles', error);
      }
    );
  }

  buscarDelivery() {
    this.binnaclesService.getBinnaclesByDelivery().subscribe(
      (data: BinnacleDeliveryDTO[]) => {
        this.dataSource.data = this.formatBinnacles(data);
        this.resetPaginator();
      },
      (error) => {
        console.error('Error fetching binnacles', error);
      }
    );
  }

  eliminar(binnacle: any) {
    this.binnaclesService.deleteBinnacle(binnacle.id).subscribe(() => {
      this.buscarTodo();
    });
  }

  modificarBinnacle() {
    console.log('Binnacle seleccionado', this.binnacleSeleccionado._id);
    delete this.binnacleSeleccionado.description;
    this.binnaclesService.updateBinnacle(this.binnacleSeleccionado._id, this.binnacleSeleccionado).subscribe(
      (response) => {
        console.log('Bitácora modificada con éxito', response);
        this.buscarTodo();
      },
      (error) => {
        console.error('Error al modificar la bitácora', error);
      }
    );
  }

  applyFilters() {
    if (this.filterActivity) {
      this.dataSource.data = this.dataSource.data.filter(binnacle => binnacle.activityType === this.filterActivity);
      this.resetPaginator();
    }
  }

  formatBinnacles(binnacles: any[]): any[] {
    return binnacles.map(binnacle => {
      if (binnacle.activityType === 'Visita') {
        const visitorBinnacle = binnacle as BinnacleVisitorDTO;
        return {
          id: visitorBinnacle._id,
          janitorID: visitorBinnacle.janitorID,
          activityType: visitorBinnacle.activityType,
          createdAt: visitorBinnacle.createdAt,
          description: `Nombre: ${visitorBinnacle.name} ${visitorBinnacle.lastName}, RUT: ${visitorBinnacle.rut} visita al departamento ${visitorBinnacle.departmentNumber}`
        };
      } else if (binnacle.activityType === 'Espacio Comunitario') {
        const spacesBinnacle = binnacle as BinnacleSpacesDTO;
        return {
          id: spacesBinnacle._id,
          janitorID: spacesBinnacle.janitorID,
          activityType: spacesBinnacle.activityType,
          createdAt: spacesBinnacle.createdAt,
          description: `Espacio: ${spacesBinnacle.spaceId}, Inicio: ${this.formatDate(spacesBinnacle.startTime)}, Fin: ${this.formatDate(spacesBinnacle.endTime)}`
        };
      } else if (binnacle.activityType === 'Delivery') {
        const deliveryBinnacle = binnacle as BinnacleDeliveryDTO;
        return {
          id: deliveryBinnacle._id,
          janitorID: deliveryBinnacle.janitorID,
          activityType: deliveryBinnacle.activityType,
          createdAt: deliveryBinnacle.createdAt,
          description: `Departamento: ${deliveryBinnacle.departNumber}, Destinatario: ${deliveryBinnacle.recipientFirstName} ${deliveryBinnacle.recipientLastName}, Entregado por: ${deliveryBinnacle.deliveryPersonName}, Entrega: ${this.formatDate(deliveryBinnacle.deliveryTime)}. Estado: ${deliveryBinnacle.status}`
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
