import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostdetailsPage } from './postdetails.page';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module'

const routes: Routes = [
  {
    path: '',
    component: PostdetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DragDropModule,
    TruncateModule,
    AngularFontAwesomeModule,SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostdetailsPage]
})
export class PostdetailsPageModule {}
