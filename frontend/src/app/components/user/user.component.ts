import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'; // Importar MatSnackBar
import { UserDTO } from '../../dto/user.dto';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog.component'; // Asumiendo que tienes un componente de confirmación

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: UserDTO[] = [];

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar // Inyectar MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openDialog(user?: UserDTO): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      data: user || undefined
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUsers();
      }
    });
  }

  deleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '500px',
      data: {
        message: '¿Estás seguro de que deseas eliminar a este usuario?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.showNotification('Usuario eliminado con éxito', 'Cerrar');
            this.getUsers(); // Actualiza la lista de usuarios después de la eliminación
          },
          error => {
            this.showNotification('Error al eliminar usuario', 'Cerrar');
            console.error(`Error eliminando al usuario: ${error.message}`, error);
          }
        );
      }
    });
  }

  showNotification(message: string, action: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // Duración en milisegundos
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'center';
    this.snackBar.open(message, action, config);
  }
}
