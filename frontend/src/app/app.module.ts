import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VisitorComponent } from './visitor/visitor.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './binnacles/binnacles.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { OrderService } from './services/order.service';
import { OrderListComponent } from './components/order-list/order-list.component';
import { VisitorService } from './services/visitor.service';
import { AuthInterceptor } from './auth.interceptor/auth.interceptor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisitorFormDialogComponent } from './visitor/visitor-form-dialog/visitor-form-dialog.component';
import { AvisosService } from './services/avisos.service';
import { AvisosListComponent } from './components/avisos/avisos-list/avisos-list.component';
import { AvisosDetailComponent } from './components/avisos/avisos-detail/avisos-detail.component';
import { AvisosFormComponent } from './components/avisos/avisos-form/avisos-form.component';
import { CommentsService } from './services/comment.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

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
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:80'],
        disallowedRoutes: ['http://localhost:80/auth/login']
      }
    }),
  ],
  providers: [
    AuthService,
    OrderService,
    VisitorService,
    AvisosService,
    CommentsService,
    HttpService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
