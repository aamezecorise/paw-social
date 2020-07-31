import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { FollowhoomanprofilePage } from './followhoomanprofile.page';
import {MatTabsModule} from '@angular/material/tabs';
const routes: Routes = [
  {
    path: '',
    component: FollowhoomanprofilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatTabsModule,
    TruncateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FollowhoomanprofilePage]
})
export class FollowhoomanprofilePageModule {}
