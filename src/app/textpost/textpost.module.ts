import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TextpostComponent } from './textpost.component';

const routes: Routes = [
  {
    path: '',
    component: TextpostComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TextpostComponent]
})
export class TextpostModule { }
