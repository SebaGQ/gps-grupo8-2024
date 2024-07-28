import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de usar la ruta correcta

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSidebarVisible = false;

  constructor(public authService: AuthService) { }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}