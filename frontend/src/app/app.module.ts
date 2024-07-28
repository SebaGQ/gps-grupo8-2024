// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VisitorComponent } from './components/visitor/visitor.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './components/binnacles/binnacles.component';
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
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    OrderListComponent,
    VisitorFormDialogComponent,
    AvisosListComponent,
    AvisosDetailComponent,
    AvisosFormComponent,
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
    ReactiveFormsModule,
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
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:80'], // Cambia esto a tu dominio permitido
        disallowedRoutes: ['http://localhost:80/auth/login'] // Cambia esto si es necesario
      }
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule
  ],
  providers: [AuthService, OrderService, VisitorService, DepartmentService, AvisosService, CommentsService, HttpService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Locale for DD/MM/YYYY format
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  bootstrap: [AppComponent]
})
export class AppModule { }
