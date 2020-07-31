import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InViewportDirective } from 'ng-in-viewport';
import { SwipeTabDirective, IonicGestureConfig } from '../../directives/swipe-tab.directive';
import { ScrollHideDirective } from '../../directives/hide-header.directive';
import { DoubleTapDirective } from '../../directives/double-tab.directive';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';


@NgModule({
  declarations: [SwipeTabDirective,InViewportDirective,
                 ScrollHideDirective,
                 DoubleTapDirective],
  imports: [
    CommonModule
  ],
  providers: [
    {
        provide: HAMMER_GESTURE_CONFIG,
        useClass: IonicGestureConfig
    },
],
  exports: [
    SwipeTabDirective,
    ScrollHideDirective,
    DoubleTapDirective,InViewportDirective
    
]
})
export class SharedModule { }
