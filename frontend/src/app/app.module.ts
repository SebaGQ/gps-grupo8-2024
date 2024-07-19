import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './components/binnacles/binnacles.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service'; // Importar el servicio Auth
import { HttpService } from './services/http.service'; // Importar el servicio HTTP
import { OrderService } from './services/order.service'; // Importar el servicio Order
import { OrderListComponent } from './components/order-list/order-list.component'; // Asegúrate de importar tu componente de órdenes
import { MatSelectModule } from '@angular/material/select'; // Importa MatSelectModule

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';



export function tokenGetter() {
  return localStorage.getItem('token');
}
import { SpacesComponent } from './spaces/spaces.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpaceFormComponent } from './space-form/space-form.component';  // Importar MatProgressSpinnerModule
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BookingComponent } from './booking/booking.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BinnaclesComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    OrderListComponent,
    SpacesComponent,
    SpaceFormComponent,
    BookingComponent,
    UserBookingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:3000'], // Cambia esto a tu dominio permitido
        disallowedRoutes: ['http://localhost:3000/auth/login'] // Cambia esto si es necesario
      }
    }),
    MatCardModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,  // Importar MatProgressSpinnerModule
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [AuthService, OrderService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
