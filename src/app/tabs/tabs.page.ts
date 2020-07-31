import { Component, ViewChild } from '@angular/core';
import { CreateEventPage } from '../create-event/create-event.page';
import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ModalController,ToastController, NavController, Platform, IonContent, Events} from '@ionic/angular';
import { ScrollHideDirective, ScrollHideConfig } from '../../directives/hide-header.directive';
import { CameraPreviewPage } from '../camera-preview/camera-preview.page';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IonTabs } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import * as $ from "jquery";
import { Keyboard } from '@ionic-native/keyboard/ngx';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})


export class TabsPage {

  // footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: 55 };
  // headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 55 }; 
  @ViewChild(IonContent, { static: false }) private content: IonContent; 
  // @ViewChild(SwipeTabDirective, {static: false}) swipeTabDirective: SwipeTabDirective;
  @ViewChild('myTabs', {static: false}) tabRef: IonTabs;

  backButtonSubscription;
  fabButtons:boolean = false;
  protected interval: any;
  isShown:boolean = false; 
  isKeyboardHide=true;

  constructor(
    public events: Events, 
    private vibration: Vibration, 
    private modalCtrl: ModalController, 
    public navCtrl: NavController,
    public keyboard: Keyboard,
    private toastCtrl: ToastController,  
    private platform: Platform) {

  }
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];

  // tslint:disable-next-line:member-ordering
  isBackDrop = false;
  // tslint:disable-next-line:member-ordering
  counter = 0;

  myPhoto: any;

  ionTabsDidChange($event) {
    // this.vibration.vibrate(100);
    console.log('[TabsPage] ionTabsDidChange, $event: ', $event);
    // this.swipeTabDirective.onTabInitialized($event.tab);
  }

  onTabChange($event) {
    // this.vibration.vibrate(100);
    console.log('[TabsPage] onTabChange, $event: ', $event);
    this.tabRef.select($event);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.keyboard.onKeyboardWillShow().subscribe(()=>{
      this.isKeyboardHide=false;
      // console.log('SHOWK');
    });

    this.keyboard.onKeyboardWillHide().subscribe(()=>{
      this.isKeyboardHide=true;
      // console.log('HIDEK');
    });

    // let contentscroll = document.querySelector('ion-content');
    // contentscroll.scrollEvents = true;
    // contentscroll.addEventListener('ionScrollStart', () => {
    //       document.querySelector('ion-tab-bar').style.display = 'none';
    //       this.isShown = true;
    // });
    // contentscroll.addEventListener('ionScrollEnd', () => {
    //       document.querySelector('ion-tab-bar').style.display = 'flex';
    //       this.isShown = false;
    // });

  }

  ionViewWillEnter() {
    this.keyboard.onKeyboardWillShow().subscribe(()=>{
      this.isKeyboardHide=false;
      // console.log('SHOWK');
    });

    this.keyboard.onKeyboardWillHide().subscribe(()=>{
      this.isKeyboardHide=true;
      // console.log('HIDEK');
    });
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

  keyboardCheck() {
    return !this.keyboard.isVisible;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  takePhoto() {
    this.navCtrl.navigateForward('/camera-preview');
  }

  takeVideo(){
    this.navCtrl.navigateForward('/video-preview');
  }

  textpost(){
    this.navCtrl.navigateForward('/textpost');
  }

  eventpage(){
    this.navCtrl.navigateForward('/event-cards');
  }

  onClick() {
    this.presentModel();
  }

  async presentToast(param:any) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 1000
    });

    return await toast.present();
  }

  async presentModel() {
    const modal = await this.modalCtrl.create({
      component: CreateEventPage
    });
    return await modal.present();
  }

  tabButtonClicked(tabNumber: string) {
    var fabs = document.querySelectorAll('ion-fab');
    for (var i = 0; i < fabs.length; i++) {
      fabs[i].activated = false;
    }
    if (tabNumber === 'tab2') { 
        this.events.publish('tabs', 'tab2'); 
    }else if(tabNumber === 'newsfeed'){
      this.events.publish('tabs', 'newsfeed'); 
    }
}

  onPress($event) {
    console.log("onPress", $event);
    $('#second-parent').click(function(){
      var e1 = $('#animatediv1');
          e1.addClass('animate');
          e1.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function (e) {
              e1.removeClass('animate');
          });
      var e2 = $('#animatediv2');
          e2.addClass('animate');
          e2.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function (e) {
              e2.removeClass('animate');
          });
      var e3 = $('#animatediv3');
          e3.addClass('animate');
          e3.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
          function (e) {
              e3.removeClass('animate');
          });        
    });
    this.startInterval();
  }

  onPressUp($event) {
    console.log("onPressUp", $event);
    this.stopInterval();
  }

  startInterval() {
    setTimeout(() => {
      let element: HTMLElement = document.getElementsByClassName('first')[0] as HTMLElement;
	    element.click();
          var fabs = document.querySelectorAll('ion-fab');
          for (var i = 0; i < fabs.length; i++) {
            fabs[i].activated = true;
          }
      // const fab = document.querySelector("ion-fab");
      // fab.style.animation = "fading 2s";
    }, 10);
  }

stopInterval() {
  this.fabButtons = false;
  // $("#first").click()
    // clearInterval(this.interval);
}

  vibrate(){
    this.vibration.vibrate(100);
    this.presentToast('Long Press on the Paw');
    console.log('Vibrated');
  }

  cameraModal() {
    // this.vibration.vibrate(100);
    // this.isBackDrop = true;
    this.counter++;
    console.log(this.counter);
    if (this.counter % 2 === 0) {
      this.isBackDrop = false;
    } else {
      this.isBackDrop = true;
    }
    console.log();
  }


}

