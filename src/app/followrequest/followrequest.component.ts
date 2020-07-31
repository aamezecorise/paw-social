import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, IonContent, Events, Platform } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-followrequest',
  templateUrl: './followrequest.component.html',
  styleUrls: ['./followrequest.component.scss'],
})
export class FollowrequestComponent implements OnInit {

  backButtonSubscription

  constructor(private platform: Platform, private toastCtrl: ToastController, private navCtrl: NavController, private nativePageTransitions: NativePageTransitions) {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      // add logic here if you want to ask for a popup before exiting
      // navigator['app'].exitApp();
      this.navCtrl.navigateBack('/tabs/tab4');
    });
   }

  ngOnInit() {}

  dismiss(){
    this.navCtrl.navigateBack('/social/tabs/tab4');
  }

}
