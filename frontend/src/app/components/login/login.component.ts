// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.credentials).subscribe(
      () => this.router.navigate(['/home']),
      error => console.error('Error logging in', error)
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
