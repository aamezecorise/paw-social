import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, IonContent,Events,ModalController} from '@ionic/angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import io from 'socket.io-client';
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  userData:any = {};
  userDetails:any = {};
  socket:any;
  notifications:any = [];
  data:boolean = true;

  @ViewChild(IonContent, { static: false }) private content: IonContent;

  constructor(
    private router: Router, 
    public events: Events,
    public navCtrl: NavController, 
    private modalCtrl: ModalController, 
    private nativePageTransitions: NativePageTransitions,
    public apiService: ApiService) {

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
    this.userData = JSON.parse(localStorage.getItem("userData"))

    window.onclick = function(event) {
      var fabs = document.querySelectorAll('ion-fab');
      for (var i = 0; i < fabs.length; i++) {
        fabs[i].activated = false;
      }
    }
    }

  ngOnInit() {
    this.getUserbyid(this.userData.id)
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.data = false;
    }, 3000);
    this.getUserbyid(this.userData.id)
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'tab4') { 
            this.content.scrollToTop(1000); 
        } 
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('tabs', () => {} );
  }

  onBack() {
    this.router.navigate(['/tabs/newsfeed']);
  }

  followrequest() {
    this.router.navigate(['/followrequest']);
  }

  doRefresh(event) {
    this.getUserbyid(this.userData.id)
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  TimeFromNow(time){
    return moment(time).fromNow()
  }

    getUserbyid(userid){
      this.notifications = [];
      this.apiService.getUserById(userid).subscribe(res => {
        this.userDetails = res['result'];
        this.notifications = res['result']['notifications'].reverse();   
        console.log(res);
        console.log(this.notifications);
      })
    }

}
