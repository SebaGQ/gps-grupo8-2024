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



export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BinnaclesComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    OrderListComponent
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
    })
  ],
  providers: [AuthService, OrderService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
