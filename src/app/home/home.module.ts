import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})


// const routes: Routes = [
//   {
//     path: '',
//     component: HomePage
//   }
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//     FormsModule,
//     IonicModule,
//     RouterModule.forChild(routes)
//   ],
//   declarations: [HomePage]
// })
export class HomePageModule {}
