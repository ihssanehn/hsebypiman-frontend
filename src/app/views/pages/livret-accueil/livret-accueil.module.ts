import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { livretAccueilComponent } from './livret-accueil.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';


const routes: Routes = [
	{
		path: '',
		component: livretAccueilComponent
	}
];

@NgModule({
  declarations: [
    livretAccueilComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    FormsModule
  ]
})
export class LivretAccueilModule { }
