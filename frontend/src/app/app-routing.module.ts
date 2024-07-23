import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { SelectWithdrawerComponent } from './components/select-withdrawer/select-withdrawer.component';
import { JanitorOrderListComponent } from './components/janitor-order-list/janitor-order-list.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'order-list', component: OrderListComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'select-withdrawer/:orderId', component: SelectWithdrawerComponent },
  { path: 'janitor-order-list', component: JanitorOrderListComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
