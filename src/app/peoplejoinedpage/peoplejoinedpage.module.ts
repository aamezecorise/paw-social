import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PeoplejoinedpagePage } from './peoplejoinedpage.page';

const routes: Routes = [
  {
    path: '',
    component: PeoplejoinedpagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PeoplejoinedpagePage]
})
export class PeoplejoinedpagePageModule {}
