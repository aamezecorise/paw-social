import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';
import { IonContent, Events,Platform,  NavController, ToastController, PopoverController, ModalController} from '@ionic/angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { InViewportMetadata } from 'ng-in-viewport';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {

  pet1 = '/assets/pet1.jpg';
  hooman1 = '/assets/hooman1.jpg';
  pet2 = '/assets/pet2.jpg';
  hooman2 = '/assets/hooman2.jpg';
  pet3 = '/assets/pet3.jpg';
  hooman3 = '/assets/hooman3.jpg';
  pet4 = '/assets/pet4.jpg';
  hooman4 = '/assets/hooman4.jpg';
  showheart = 0;
  book = false;
  exploredata: any;
  backButtonSubscription;


  video:any = [{src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'8'},
               {src:'assets/images/1.jpg',id:'3'},
               {src:'assets/images/3.jpg',id:'4'},
               {src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'5'},
               {src:'assets/images/4.jpg',id:'6'},
               {src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'2'},
               {src:'assets/images/5.jpg',id:'7'},
               {src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'8'},
               {src:'assets/images/6.jpg',id:'9'},
               {src:'assets/images/7.jpg',id:'10'},
               {src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'11'},
               {src:'assets/images/8.jpg',id:'12'},
               {src:'assets/images/9.jpg',id:'13'},
               {src:'assets/images/10.jpg',id:'14'},
               {src:'assets/images/11.jpg',id:'15'},
               {src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'16'},
               {src:'assets/images/12.jpg',id:'17'},
               {src:'assets/images/13.jpg',id:'18'},
               {src:'assets/images/14.jpg',id:'19'},
               {src:'https://ia800501.us.archive.org/10/items/BigBuckBunny_310/big_buck_bunny_640_512kb.mp4',id:'20'}];

  constructor(private platform: Platform, private modalCtrl: ModalController, private popOverCtrl: PopoverController, private toastCtrl: ToastController, private navCtrl: NavController, public events: Events, private router: ActivatedRoute, private nativePageTransitions: NativePageTransitions) { 

    this.router.queryParams.subscribe((data)=>{
      this.exploredata = JSON.stringify(data);
      console.log(this.exploredata);
    })

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      // add logic here if you want to ask for a popup before exiting
      // navigator['app'].exitApp();
      this.navCtrl.navigateBack('/tabs/tab2');
    });


  }

  ngOnInit() {

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onUserProfile() {
    // this.navCtrl.navigateForward('/tabs/hooman-profile');
  }

  bookTrue() {
    this.book = true;
    this.presentToast();
  }

  bookFalse() {
    this.book = false;
  }

  async presentPopover(ev: any) {
    const popover = await this.popOverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Post Bookmarked',
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

  public changeVideoAudio(id: string) {
    let vid: any = document.getElementById('media-' + id);
    vid.muted = !vid.muted;
  }

  // onIntersection($event) {
  //   const { [InViewportMetadata]: { entry }, target } = $event;
  //   const ratio = entry.intersectionRatio;
  //   const vid = target;
  //   ratio >= 0.65 ? vid.play() : vid.pause();
  // }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }


}
