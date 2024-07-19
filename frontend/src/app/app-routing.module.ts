import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BinnaclesComponent } from './components/binnacles/binnacles.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderListComponent } from './components/order-list/order-list.component'; 
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceFormComponent } from './space-form/space-form.component';
import { BookingComponent } from './booking/booking.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'binnacles', component: BinnaclesComponent, },
  { path: 'order-list', component: OrderListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'spaces', component: SpacesComponent },
  { path: 'create-space', component: SpaceFormComponent },
  { path: 'create-space/:id', component: SpaceFormComponent },
  { path: 'create-space/:id', component: SpaceFormComponent }, // Ruta para actualizar espacio
  { path: 'bookings/:id', component: BookingComponent }, // Ruta para ver y crear reservas para un espacio específico
  { path: 'my-bookings', component: UserBookingsComponent }, // Ruta para ver las reservas del usuario
  { path: 'booking/:id', component: BookingComponent },
  { path: 'booking/:id/:bookingId', component: BookingComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full'},
  { path: '', component: HomeComponent },
];

@NgModule({
  imports:
    [RouterModule.forRoot(routes)],
  exports:
    [RouterModule],

})
export class AppRoutingModule { }
