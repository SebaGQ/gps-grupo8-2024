// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VisitorComponent } from './components/visitor/visitor.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule,  ReactiveFormsModule  } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { OrderService } from './services/order.service';
import { OrderListComponent } from './components/order-list/order-list.component';
import { VisitorService } from './services/visitor.service';
import { AuthInterceptor } from './auth.interceptor/auth.interceptor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisitorFormDialogComponent } from './components/visitor-form-dialog/visitor-form-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatGridListModule} from '@angular/material/grid-list';
import { MY_FORMATS } from './My-format';
import { DepartmentComponent } from './components/department/department.component';
import { UserComponent } from './components/user/user.component';
import { DepartmentFormDialogComponent } from './components/department-form-dialog/department-form-dialog.component';
import { DepartmentService } from './services/department.service';
import { UserFormDialogComponent } from './components/user-form-dialog/user-form-dialog.component';


import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';



import { SpacesComponent } from './spaces/spaces.component';
import { SpaceFormComponent } from './space-form/space-form.component';
import { BookingComponent } from './booking/booking.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { BinnaclesComponent } from './components/binnacles/binnacles.component';
import { BinnacleFormDialog } from './components/binnacle-form-dialog/binnacle-form-dialog.component';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog.component';

import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AdminBookingsComponent } from './admin-bookings/admin-bookings.component';
import { DayTranslatePipe } from './day-translate.pipe';





export function tokenGetter() {
  return localStorage.getItem('token');
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    VisitorComponent,
    HomeComponent,
    BinnaclesComponent,
    BinnacleFormDialog,
    ConfirmDialog,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    OrderListComponent,
    VisitorFormDialogComponent,
    SpacesComponent,
    SpaceFormComponent,
    BookingComponent,
    UserBookingsComponent,
    AdminBookingsComponent,
    DayTranslatePipe,
    DepartmentComponent,
    UserComponent,
    DepartmentFormDialogComponent,
    UserFormDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    MatGridListModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:80'], // Cambia esto a tu dominio permitido
        disallowedRoutes: ['http://localhost:80/auth/login'] // Cambia esto si es necesario
      }
    }),
    BrowserAnimationsModule
  ],
  // providers: [AuthService, OrderService, HttpService, VisitorService, 
  //   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  //   { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  //   { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
//],
  providers: [AuthService, OrderService,VisitorService, DepartmentService, HttpService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Locale for DD/MM/YYYY format
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
