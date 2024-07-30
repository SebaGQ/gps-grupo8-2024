import { Component, ViewChild, AfterViewInit, AfterViewChecked, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BinnaclesService } from '../../services/binnacles.service';
import { AuthService } from '../../services/auth.service';
import { BinnacleDTO } from 'src/app/dto/binnacle.dto';
import { BinnacleVisitorDTO } from 'src/app/dto/binnacleVisitor.dto';
import { BinnacleSpacesDTO } from 'src/app/dto/binnacleSpaces.dto';
import { BinnacleDeliveryDTO } from 'src/app/dto/binnacleDelivery.dto';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup} from '@angular/forms';
import { BinnacleFormDialog } from '../binnacle-form-dialog/binnacle-form-dialog.component';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';
import moment from 'moment';

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
  binnacleForm: FormGroup = new FormGroup({});
  showForm: boolean = false;
  binnacles: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private binnaclesService: BinnaclesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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

  exportToExcel() {
    this.binnaclesService.getBinnacleExcel().subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = 'bitacoras.xlsx';
        link.click();
        this.showNotification('Archivo Excel descargado con éxito', 'Cerrar');
      },
      (error) => {
        this.showNotification('Error al descargar el archivo Excel', 'Cerrar');
        console.error('Error al descargar el archivo Excel', error);
      }
    );
  }

  openForm() {
    console.log('Abriendo formulario');
    const dialogRef = this.dialog.open(BinnacleFormDialog, {
      width: '600px',
      data: { activityType: this.selectedActivity }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del formulario:', result);
        let formattedData;
        // Aquí puedes añadir la lógica para guardar la bitácora usando tu servicio
        console.log('Actividad seleccionada:', this.selectedActivity);
        switch (result.activityType) {
          case 'Visita':
            formattedData = this.mapToVisitorDTO(result);
            console.log('Datos formateados:', formattedData);
            this.binnaclesService.createEntryVisitor(formattedData).subscribe(
              response => {
                this.showNotification('Bitácora creada con éxito', 'Cerrar');
                this.buscarVisita(); // Actualiza la lista de bitácoras después de la creación
              },
              error => {
                this.showNotification(`Error al crear la bitácora ${error.error.message || error.message}`, 'Cerrar');
                console.error('Error creando la bitácora', error);
              }
            );
            break;
          case 'Espacio Comunitario':
            console.log('Datos formateados:', result);
            formattedData = this.mapToSpacesDTO(result);
            console.log('Datos formateados:', formattedData);
            this.binnaclesService.createEntryBooking(formattedData).subscribe(
              response => {
                this.showNotification('Bitácora creada con éxito', 'Cerrar');
                this.buscarEspacio(); // Actualiza la lista de bitácoras después de la creación
              },
              error => {
                this.showNotification(`Error al crear la bitácora ${error.error.message || error.message}`, 'Cerrar');
                console.error('Error creando la bitácora', error);
              }
            );
            break;
          case 'Delivery':
            console.log('Datos formateados:', result);
            formattedData = this.mapToDeliveryDTO(result);
            this.binnaclesService.createEntryDelivery(formattedData).subscribe(
              response => {
                this.showNotification('Bitácora creada con éxito', 'Cerrar');
                this.buscarDelivery(); // Actualiza la lista de bitácoras después de la creación
              },
              error => {
                this.showNotification(`Error al crear la bitácora ${error.error.message || error.message}`, 'Cerrar');
                console.error('Error creando la bitácora', error);
              }
            );
            break;
          default:
            console.error('Tipo de actividad no soportado');
        }
      }
    });
  }

  showNotification(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.duration = 10005000; // Duración en milisegundos
    config.verticalPosition = 'top';
    config.horizontalPosition = 'right'; 
    this.snackBar.open(message, action, config);
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
      const formattedDate = moment(this.selectedDate).format('YYYY-MM-DD');
      console.log('Fecha seleccionada:', formattedDate);
      this.binnaclesService.getBinnaclesByDate(formattedDate).subscribe(
        (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO | BinnacleDeliveryDTO)[]) => {
          this.dataSource.data = this.formatBinnacles(data);
          this.resetPaginator();
        },
        (error) => {
          const formattedDate = moment(this.selectedDate).format('DD-MM-YYYY');
          this.showNotification('No se encontraron bitácoras en esta fecha '+formattedDate, 'Cerrar');
        }
      );
    }
  }

  buscarConserje() {
    if (this.janitorName) {
      this.binnaclesService.getBinnacleByJanitor(this.janitorName).subscribe(
        (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO | BinnacleDeliveryDTO)[]) => {
          this.dataSource.data = this.formatBinnacles(data);
          this.resetPaginator();
        },
        (error) => {
          console.error(`Error ${error.error.message || error.message}`, error);
        }
      );
    }
  }

  buscarTodo() {
    this.binnaclesService.getAllBinnacles().subscribe(
      (data: (BinnacleDTO | BinnacleVisitorDTO | BinnacleSpacesDTO | BinnacleDeliveryDTO)[]) => {
        this.dataSource.data = this.formatBinnacles(data);
        this.resetPaginator();
      },
      (error) => {
        console.error(`Error ${error.error.message || error.message}`, error);
      }
    );
  }

  buscarVisita() {
    console.log('Buscando visitas');
    this.binnaclesService.getBinnaclesByVisitor().subscribe(
      (data: BinnacleVisitorDTO[] | BinnacleDTO[]) => {
        console.log('Datos de visitas:', data);
        this.dataSource.data = this.formatBinnacles(data);
        this.resetPaginator();
      },
      (error) => {
        console.error(`Error ${error.error.message || error.message}`, error);
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
        console.error(`Error ${error.error.message || error.message}`, error);
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
        console.error(`Error ${error.error.message || error.message}`, error);
      }
    );
  }

  eliminar(binnacle: any) {
    console.log('Binnacle seleccionado para borrar', binnacle);
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: { message: '¿Estás seguro de que deseas eliminar esta bitácora?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.binnaclesService.deleteBinnacle(binnacle.id).subscribe(
          response => {
            this.showNotification('Bitácora eliminada con éxito', 'Cerrar');
            this.buscarTodo(); // Actualiza la lista de bitácoras después de la eliminación
          },
          error => {
            this.showNotification('Error al eliminar la bitácora', 'Cerrar');
            console.error(`Error eliminando la bitácora ${error.error.message || error.message}`, error);
          }
        );
      }
    });
  }

  modificarBinnacle(binnacle: any) {
    console.log('Binnacle seleccionado', binnacle.id);
    
    // Recuperar la bitácora completa utilizando el servicio
    this.binnaclesService.getBinnacleById(binnacle.id).subscribe(
      (fullBinnacle) => {
        console.log('Bitácora completa:', fullBinnacle);
        // Abrir el diálogo con los datos recuperados
        const dialogRef = this.dialog.open(BinnacleFormDialog, {
          width: '400px',
          data: { activityType: fullBinnacle.activityType, binnacle: fullBinnacle }
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const id = fullBinnacle._id;
            console.log('Bitácora modificada:', result);
            // Aquí puedes añadir la lógica para actualizar la bitácora usando tu servicio
            this.binnaclesService.updateBinnacle(id ?? '', result).subscribe(
              response => {
                this.showNotification('Bitácora modificada con éxito', 'Cerrar');
                this.buscarTodo(); // Actualiza la lista de bitácoras después de la modificación
              },
              error => {
                this.showNotification(`Error al modificar la bitácora ${error.error.message || error.message}`, 'Cerrar');
                console.error('Error modificando la bitácora', error);
              }
            );
          }
        });
      },
      (error) => {
        console.error('Error al recuperar la bitácora completa', error);
        this.showNotification(`Error al recuperar la bitácora Error ${error.error.message || error.message}`, 'Cerrar');
      }
    );
  }
  
  // Función para mapear los datos del formulario a BinnacleVisitorDTO
mapToVisitorDTO(data: any): BinnacleVisitorDTO {
  return {
    activityType: data.activityType || '',
    departmentNumber: data.departNumber || '',
    name: data.name || '',
    lastName: data.lastName || '',
    rut: data.rut || '',
    entryDate: data.entryDate || '',
    exitDate: data.exitDate || '',
    roles: [data.roles]
  };
}

// Función para mapear los datos del formulario a BinnacleSpacesDTO
mapToSpacesDTO(data: any): BinnacleSpacesDTO {
  return {
    spaceId: data.spaceId || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    userId: data.userId || ''
  };
}

// Función para mapear los datos del formulario a BinnacleDeliveryDTO
mapToDeliveryDTO(data: any): BinnacleDeliveryDTO {
  return {
    activityType: data.activityType,
    departmentNumber: data.departNumber || '',
    recipientFirstName: data.recipientFirstName || '',
    recipientLastName: data.recipientLastName || '',
    deliveryTime: data.deliveryTime || '',
    deliveryPersonName: data.deliveryPersonName || '',
    status: data.status || '',
  };
}

  formatBinnacles(binnacles: any[]): any[] {
    return binnacles.map(binnacle => {
      if (binnacle.activityType === 'Visita') {
        const visitorBinnacle = binnacle as BinnacleVisitorDTO;
        return {
          id: visitorBinnacle._id ?? visitorBinnacle._id,
          janitorID: visitorBinnacle.janitorID,
          activityType: visitorBinnacle.activityType,
          createdAt: visitorBinnacle.createdAt,
          description: `Nombre: ${visitorBinnacle.name} ${visitorBinnacle.lastName}, RUT: ${visitorBinnacle.rut} visita al departamento ${visitorBinnacle.departmentNumber}`
        };
      } else if (binnacle.activityType === 'Espacio Comunitario') {
        const spacesBinnacle = binnacle as BinnacleSpacesDTO;
        return {
          id: spacesBinnacle._id ?? spacesBinnacle._id,
          janitorID: spacesBinnacle.janitorID,
          activityType: spacesBinnacle.activityType,
          createdAt: spacesBinnacle.createdAt,
          description: `Espacio: ${spacesBinnacle.spaceId}, Inicio: ${this.formatDate(spacesBinnacle.startTime)}, Fin: ${this.formatDate(spacesBinnacle.endTime)}, Usuario: ${spacesBinnacle.userId}`
        };
      } else if (binnacle.activityType === 'Delivery') {
        const deliveryBinnacle = binnacle as BinnacleDeliveryDTO;
        return {
          id: deliveryBinnacle._id ?? deliveryBinnacle._id,
          janitorID: deliveryBinnacle.janitorID,
          activityType: deliveryBinnacle.activityType,
          createdAt: deliveryBinnacle.createdAt,
          description: `Departamento: ${deliveryBinnacle.departmentNumber}, Destinatario: ${deliveryBinnacle.recipientFirstName} ${deliveryBinnacle.recipientLastName}, Entregado por: ${deliveryBinnacle.deliveryPersonName}, Entrega: ${this.formatDate(deliveryBinnacle.deliveryTime)}. Estado: ${deliveryBinnacle.status}`
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