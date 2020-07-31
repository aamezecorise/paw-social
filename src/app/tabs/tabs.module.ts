import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
// import { EventCardsPage } from '../event-cards/event-cards.page';
import { DirectivesModule } from '../../directives/directives.module';
import { SharedModule } from '../shared/shared.module'

const routes: Routes = [
  {
    path: '',
    component: TabsPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,SharedModule,
    TabsPageRoutingModule, DirectivesModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
