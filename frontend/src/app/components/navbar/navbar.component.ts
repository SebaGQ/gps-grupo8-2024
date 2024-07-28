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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAuthState().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }
  navigateTo(destination: string) {
    if (destination === 'home') {
      if (this.isAuthenticated) {
        this.router.navigate(['/home']);
      }else{
        this.router.navigate(['/home']);
      }
    }
    if (destination === "binnacles") {
      if (this.isAuthenticated) {
        this.router.navigate(['/binnacles']);
      }else{
        this.router.navigate(['/login']);
      }
    }
    if (destination === "spaces") {
      if (this.isAuthenticated) {
        this.router.navigate(['/spaces']);
      }else{
        this.router.navigate(['/login']);
      }
    
    }
    if (destination === "visitor") {
      if (this.isAuthenticated) {
        this.router.navigate(['/visitor']);
      }else{
        this.router.navigate(['/login']);
      }
    }
    if (destination === "my-bookings") {
      if (this.isAuthenticated) {
        this.router.navigate(['/my-bookings']);
      }else{
        this.router.navigate(['/login']);
      }
    }
    if (destination === "admin-bookings") {
      if (this.isAuthenticated) {
        this.router.navigate(['/admin-bookings']);
      }else{
        this.router.navigate(['/login']);
      }
    }
    if (destination === "user") {
      if (this.isAuthenticated) {
        this.router.navigate(['/user']);
      }else{
        this.router.navigate(['/login']);
      }
    }
    if (destination === "department") {
      if (this.isAuthenticated) {
        this.router.navigate(['/department']);
      }else{
        this.router.navigate(['/login']);
      }
    }
  }
  logout() {
    this.authService.logout();
    // Redirigir a la página de inicio
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}