import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { EventCardsPage } from './event-cards.page';
// import { ScrollHideDirective } from '../../directives/hide-header.directive';

const routes: Routes = [
  {
    path: '',
    component: EventCardsPage
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
  declarations: [EventCardsPage]
})
export class EventCardsPageModule {}
