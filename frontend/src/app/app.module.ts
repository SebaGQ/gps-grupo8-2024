import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';


import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service'; // Importar el servicio Auth
import { HttpService } from './services/http.service'; // Importar el servicio HTTP
import { UserService } from './services/user.service';
import { OrderService } from './services/order.service'; // Importar el servicio Order
import { OrderListComponent } from './components/order-list/order-list.component'; // Asegúrate de importar tu componente de órdenes
import { WithdrawOrderComponent } from './components/withdraw-order/withdraw-order.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { SelectWithdrawerComponent } from './components/select-withdrawer/select-withdrawer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JanitorOrderListComponent } from './components/janitor-order-list/janitor-order-list.component';



export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    OrderListComponent,
    CreateOrderComponent,
    SelectWithdrawerComponent,
    WithdrawOrderComponent,
    JanitorOrderListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatRadioModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:81'], // Cambia esto a tu dominio permitido
        disallowedRoutes: ['http://localhost:81/auth/login'] // Cambia esto si es necesario
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [AuthService, OrderService, UserService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
