import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
//import { ToastrModule } from 'ngx-toastr/toastr/toastr.module';

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

// Componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { VisitorComponent } from './components/visitor/visitor.component';
import { BinnaclesComponent } from './components/binnacles/binnacles.component';
import { BinnacleFormDialog } from './components/binnacle-form-dialog/binnacle-form-dialog.component';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { VisitorFormDialogComponent } from './components/visitor-form-dialog/visitor-form-dialog.component';
import { AvisosListComponent } from './components/avisos/avisos-list/avisos-list.component';
import { AvisosDetailComponent } from './components/avisos/avisos-detail/avisos-detail.component';
import { AvisosFormComponent } from './components/avisos/avisos-form/avisos-form.component';
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceFormComponent } from './space-form/space-form.component';
import { BookingComponent } from './booking/booking.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { AdminBookingsComponent } from './admin-bookings/admin-bookings.component';
import { DayTranslatePipe } from './day-translate.pipe';
import { DepartmentComponent } from './components/department/department.component';
import { UserComponent } from './components/user/user.component';
import { DepartmentFormDialogComponent } from './components/department-form-dialog/department-form-dialog.component';
import { UserFormDialogComponent } from './components/user-form-dialog/user-form-dialog.component';

// Servicios
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { OrderService } from './services/order.service';
import { VisitorService } from './services/visitor.service';
import { AuthInterceptor } from './auth.interceptor/auth.interceptor.component';
import { AvisosService } from './services/avisos.service';
import { CommentsService } from './services/comment.service';
import { DepartmentService } from './services/department.service';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { JanitorOrderListComponent } from './components/janitor-order-list/janitor-order-list.component';
import { WithdrawOrderComponent } from './components/withdraw-order/withdraw-order.component';
import { SelectWithdrawerComponent } from './components/select-withdrawer/select-withdrawer.component';

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
    JanitorOrderListComponent,
    SelectWithdrawerComponent,
    WithdrawOrderComponent,
    BinnaclesComponent,
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
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
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
        allowedDomains: ['localhost:80'],
        disallowedRoutes: ['http://localhost:80/auth/login']
      }
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    
    AuthService,
   
    OrderService,
   
    VisitorService,
    DepartmentService,
   
    AvisosService,
   
    CommentsService,
    CreateOrderComponent,
   
    HttpService,
   
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Locale for DD/MM/YYYY format
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
