import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSidebarVisible = false;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getAuthState().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  navigateTo(destination: string) {
    if (this.isAuthenticated || destination === 'home') {
      this.router.navigate([`/${destination}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de inicio
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}