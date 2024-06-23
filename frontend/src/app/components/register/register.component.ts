import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserDTO } from '../../dto/user.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: UserDTO = {
    firstName: '',
    lastName: '',
    rut: '',
    password: '',
    email: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe(
      () => this.router.navigate(['/login']),
      error => console.error('Error registering', error)
    );
  }
}
