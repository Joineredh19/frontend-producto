import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoFormComponent } from './components/producto-form/producto-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
      path:'',
      component:HomeComponent,
      title:'Página de inicio'
  },
  {
      path:'producto-form/:id',
      component:ProductoFormComponent,
      title:'Formulario de producto'
  },
  {
      path:'**',
      redirectTo:'',
      pathMatch:'full'
  }
];
export class AppRoutingModule { }

