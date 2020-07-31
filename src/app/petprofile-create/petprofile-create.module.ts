import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PetprofileCreatePage } from './petprofile-create.page';
import { MaterialModule } from '../material.module';
import { IonicSelectableModule } from 'ionic-selectable';



const routes: Routes = [
  {
    path: '',
    component: PetprofileCreatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PetprofileCreatePage]
})
export class PetprofileCreatePageModule {}
