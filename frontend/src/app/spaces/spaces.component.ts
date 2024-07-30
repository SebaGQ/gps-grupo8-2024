import { Component, OnInit } from '@angular/core';
import { SpaceService } from '../services/space.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'; 
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.css']
})
export class SpacesComponent implements OnInit {
  spaces$: Observable<any[]> | undefined;
  isAdminOrJanitor: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private spaceService: SpaceService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar, // Inyectar MatSnackBar
    public dialog: MatDialog // Inyectar MatDialog
  ) { }

  ngOnInit(): void {
    this.spaces$ = this.spaceService.getCommonSpaces();
    this.isAdminOrJanitor = this.authService.isAdminOrJanitor();
    this.isAdmin = this.authService.isAdmin();
  }

  loadSpaces(): void {
    this.spaces$ = this.spaceService.getCommonSpaces();
  }

  addSpace(space: any): void {
    this.spaceService.createCommonSpace(space).subscribe(() => {
      this.showNotification('Espacio añadido con éxito', 'Cerrar');
      this.loadSpaces();
    }, error => {
      this.showNotification('Error al añadir espacio', 'Cerrar');
      console.error(`Error añadiendo espacio: ${error.message}`, error);
    });
  }

  updateSpace(id: string): void {
    this.router.navigate(['/create-space', id]);
  }

  deleteSpace(_id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        message: '¿Estás seguro de que deseas eliminar este espacio?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spaceService.deleteCommonSpace(_id).subscribe(
          () => {
            this.showNotification('Espacio eliminado con éxito', 'Cerrar');
            this.loadSpaces();
          },
          error => {
            this.showNotification('Error al eliminar espacio', 'Cerrar');
            console.error(`Error eliminando espacio: ${error.message}`, error);
          }
        );
      }
    });
  }

  bookSpace(id: string): void {
    this.router.navigate(['/bookings', id]);
  }

  showNotification(message: string, action: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // Duración en milisegundos
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }
}
