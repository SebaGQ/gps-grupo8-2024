// visitor-list.component.ts
import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../../services/visitor.service';
import { VisitorDTO } from '../../dto/visitor.dto';
import { VisitorFormDialogComponent } from '../visitor-form-dialog/visitor-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css'],
})
export class VisitorComponent implements OnInit {
  visitors: VisitorDTO[] = [];
  activeVisitors: VisitorDTO[] = [];
  completedVisitors: VisitorDTO[] = [];
  filteredVisitors: VisitorDTO[] = [];
  showCompleted: boolean = false;
  selectedDate: any = null;

  constructor(
    private visitorService: VisitorService,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getActiveVisitors();
  }

  getActiveVisitors() {
    this.visitorService.getActiveVisitors().subscribe((data) => {
      this.visitors = data;
      this.activeVisitors = data;
      this.filteredVisitors = data;
    });
  }

  getCompletedVisitors() {
    this.visitorService.getVisitors().subscribe((data) => {
      this.visitors = data.filter(
        (visitor) => !this.isExitDate9999(visitor.exitDate)
      );
      this.completedVisitors = this.visitors;
      this.filteredVisitors = this.visitors;
    });
  }

  toggleCompletedVisitors() {
    this.showCompleted = !this.showCompleted;
    if (this.showCompleted) {
      this.getCompletedVisitors();
    } else {
      this.getActiveVisitors();
    }
  }

  openDialog(visitor?: VisitorDTO) {
    const dialogRef = this.dialog.open(VisitorFormDialogComponent, {
      data: visitor || undefined,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getActiveVisitors();
    });
  }

  registerExit(visitorId: string) {
    this.visitorService.registerExit(visitorId).subscribe(
      () => {
        this.getActiveVisitors();
      },
      (error) => {
        console.error('Error al registrar salida de visitante', error);
      }
    );
  }

  showNotification(message: string, action: string) {
    const config = new MatSnackBarConfig();
    config.duration = 10005000; // Duración en milisegundos
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }

  deleteVisitor(visitorId: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        message: '¿Estás seguro de que deseas eliminar a este visitante?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.visitorService.deleteVisitor(visitorId).subscribe(
          () => {
            this.showNotification('Visitante eliminado con éxito', 'Cerrar');
            this.getActiveVisitors(); // Actualiza la lista de visitantes después de la eliminación
          },
          (error) => {
            this.showNotification('Error al eliminar visitante', 'Cerrar');
            console.error(
              `Error eliminando al visitante: ${error.message}`,
              error
            );
          }
        );
      }
    });
  }
  isExitDate9999(exitDate: string | Date): boolean {
    return new Date(exitDate).getFullYear() === 9999;
  }

  filterByDate(event: any) {
    const selectedDate = event.value;
    this.filteredVisitors = this.visitors.filter((visitor) => {
      const entryDate = new Date(visitor.entryDate);
      return entryDate.toDateString() === new Date(selectedDate).toDateString();
    });
    // If needed, manually set the value of the selectedDate to update the view
    this.selectedDate = selectedDate;
  }

  clearDateFilter() {
    this.selectedDate = null;
    this.filteredVisitors = this.visitors; // Reset to show all visitors
  }

  // Métodos para verificar roles
  canDeleteVisitor(): boolean {
    return this.authService.isAdmin();
  }

  canModifyVisitor(): boolean {
    return this.authService.isAdmin() || this.authService.isJanitor();
  }

  canViewVisitors(): boolean {
    return this.authService.isAdmin() || this.authService.isJanitor();
  }
}
