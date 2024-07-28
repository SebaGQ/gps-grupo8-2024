// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor/visitor.component';
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './binnacles/binnacles.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { AvisosListComponent } from './components/avisos/avisos-list/avisos-list.component';
import { AvisosFormComponent } from './components/avisos/avisos-form/avisos-form.component';
import { AvisosDetailComponent } from './components/avisos/avisos-detail/avisos-detail.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'binnacles', component: BinnaclesComponent },
  { path: 'order-list', component: OrderListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'visitor', component: VisitorComponent },
  { path: 'avisos', component: AvisosListComponent },
  { path: 'avisos/new', component: AvisosFormComponent },
  { path: 'avisos/:id', component: AvisosDetailComponent },
  { path: 'avisos/edit/:id', component: AvisosFormComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
