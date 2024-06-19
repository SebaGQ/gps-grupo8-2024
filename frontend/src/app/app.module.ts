// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisitorComponent } from './visitor/visitor.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './interceptors/auth.service'; // Importa el interceptor

@NgModule({
  declarations: [
    AppComponent,
    VisitorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
