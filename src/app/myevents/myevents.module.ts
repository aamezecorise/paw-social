import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { MyeventsPage } from './myevents.page';

const routes: Routes = [
  {
    path: '',
    component: MyeventsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruncateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyeventsPage]
})
export class MyeventsPageModule {}
