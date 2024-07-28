import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  login() {
    this.authService.login(this.credentials).subscribe(
      () => {
        this.toastr.success('Login exitoso');
        this.router.navigate(['/home']);
      },
      error => {
        this.toastr.error('Error al iniciar sesión. Verifica tus credenciales.');
        console.error('Error logging in', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
