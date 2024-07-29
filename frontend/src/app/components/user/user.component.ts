import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDTO } from '../../dto/user.dto';
import { RoleDTO } from '../../dto/role.dto';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: UserDTO[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) {}

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
    this.userService.deleteUser(userId).subscribe(() => {
      this.getUsers();
    });
  }
}
