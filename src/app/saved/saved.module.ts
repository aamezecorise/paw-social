import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SavedPage } from './saved.page';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module'

const routes: Routes = [
  {
    path: '',
    component: SavedPage
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
  declarations: [SavedPage]
})
export class SavedPageModule {}
