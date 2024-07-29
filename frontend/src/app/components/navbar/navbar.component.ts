import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isSidebarVisible = false;
  isAuthenticated: boolean = false;
  isAdminOrJanitor: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getAuthState().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
    this.isAdminOrJanitor = this.authService.isAdminOrJanitor();
    this.isAdmin = this.authService.isAdmin();
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  navigateTo(destination: string) {
    if (this.isAuthenticated || destination === 'home') {
      if (destination === 'admin-bookings' && !this.isAdminOrJanitor) {
        // Mostrar algún mensaje de error o alerta si es necesario
        return;
      }
      this.router.navigate([`/${destination}`]);
    } else {
      this.router.navigate(['/login']);
    }
    this.isSidebarVisible = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de inicio
  }
}