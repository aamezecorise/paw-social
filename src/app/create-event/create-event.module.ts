import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateEventPage } from './create-event.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

const routes: Routes = [
  {
    path: '',
    component: CreateEventPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    RouterModule.forChild(routes)
  ],
  providers:[Camera],
  declarations: [CreateEventPage]
})
export class CreateEventPageModule {}
