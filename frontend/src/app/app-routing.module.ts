import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceFormComponent } from './space-form/space-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'spaces', component: SpacesComponent },
  { path: 'create-space', component: SpaceFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
