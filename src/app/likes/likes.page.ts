import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController, Platform,ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';
import * as moment from 'moment';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.page.html',
  styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit {

view:any;
socket:any;
userData: any = {};
url:any;
likesData:any;

  constructor(
  	private activateroute: ActivatedRoute, 
    private router: Router, 
    public apiService: ApiService,
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions, 
    private platform: Platform,
    public mainService: MainService,
    private toastCtrl: ToastController, 
    private socialSharing: SocialSharing) { 

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.likesData = JSON.parse(params.data).likes;
        console.log(this.likesData);
      }
      if (params && params.route) {
        this.url = params.route;
        console.log(this.url);
      }
    });

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
  }

  ngOnInit() {
  }

	onBack() {
		console.log('back');
	    // let navigationExtras: NavigationExtras = {
	    //   queryParams: {
	    //     data: JSON.stringify(this.view)
	    //   }
	    // };
	    if(this.url == 'newsfeed'){
	      this.router.navigate(['social/tabs/newsfeed']);
	    }
	    if(this.url == 'saved'){
	      this.router.navigate(['social/tabs/saved']);
	    }
	    if(this.url == 'postdetails'){
	      this.router.navigate(['social/tabs/postdetails']);
	    }
	    if(this.url == 'followhoomanprofile'){
	      this.router.navigate(['social/tabs/followhoomanprofile']);
	    }
	    
	    
    // this.navCtrl.navigateBack('/myevents');
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  	onProfileClick(user) {
		console.log(user);
	    let navigationExtras: NavigationExtras = {
	      queryParams: {
	        data: JSON.stringify(user),
          route: JSON.stringify(this.view)
	      }
	    };
	    this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
	  }

}
