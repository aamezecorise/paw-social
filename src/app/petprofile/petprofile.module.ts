import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PetprofilePage } from './petprofile.page';
import {MatTabsModule} from '@angular/material/tabs';
const routes: Routes = [
  {
    path: '',
    component: PetprofilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PetprofilePage]
})
export class PetprofilePageModule {}
