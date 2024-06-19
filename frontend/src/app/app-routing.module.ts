// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitorComponent } from './visitor/visitor.component';

const routes: Routes = [
  { path: 'visitor', component: VisitorComponent },
  { path: '', redirectTo: '/visitor', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
