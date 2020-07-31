import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FollowunfollowPage } from './followunfollow.page';
import { MatTabsModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: FollowunfollowPage
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
  declarations: [FollowunfollowPage]
})
export class FollowunfollowPageModule {}
