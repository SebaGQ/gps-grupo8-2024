// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor/visitor.component';

const routes: Routes = [
  { path: 'visitor', component: VisitorComponent },
  { path: '', redirectTo: '/visitor', pathMatch: 'full' }
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './binnacles/binnacles.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderListComponent } from './components/order-list/order-list.component'; 

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'binnacles', component: BinnaclesComponent },
  { path: 'order-list', component: OrderListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports:
    [RouterModule.forRoot(routes)],
  exports:
    [RouterModule],

})
export class AppRoutingModule { }
