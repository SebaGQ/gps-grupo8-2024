// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './components/visitor/visitor.component';
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './components/binnacles/binnacles.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceFormComponent } from './space-form/space-form.component';
import { BookingComponent } from './booking/booking.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { AdminBookingsComponent } from './admin-bookings/admin-bookings.component';
import { DepartmentComponent } from './components/department/department.component';
import { UserComponent } from './components/user/user.component';
import { AvisosListComponent } from './components/avisos/avisos-list/avisos-list.component';
import { AvisosFormComponent } from './components/avisos/avisos-form/avisos-form.component';
import { AvisosDetailComponent } from './components/avisos/avisos-detail/avisos-detail.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'binnacles', component: BinnaclesComponent, },
  { path: 'order-list', component: OrderListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'visitor', component: VisitorComponent },
  { path: 'spaces', component: SpacesComponent },
  { path: 'create-space', component: SpaceFormComponent },
  { path: 'create-space/:id', component: SpaceFormComponent },
  { path: 'create-space/:id', component: SpaceFormComponent }, // Ruta para actualizar espacio
  { path: 'bookings/:id', component: BookingComponent }, // Ruta para ver y crear reservas para un espacio específico
  { path: 'my-bookings', component: UserBookingsComponent }, // Ruta para ver las reservas del usuario
  { path: 'booking/:id', component: BookingComponent },
  { path: 'booking/:id/:bookingId', component: BookingComponent },
  { path: 'admin-bookings', component: AdminBookingsComponent },
  { path: '', component: HomeComponent },
  { path: 'user', component: UserComponent },
  { path: 'department', component: DepartmentComponent },
  { path: 'avisos', component: AvisosListComponent },
  { path: 'avisos/new', component: AvisosFormComponent },
  { path: 'avisos/:id', component: AvisosDetailComponent },
  { path: 'avisos/edit/:id', component: AvisosFormComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports:
    [RouterModule.forRoot(routes)],
  exports:
    [RouterModule],

})
export class AppRoutingModule { }
