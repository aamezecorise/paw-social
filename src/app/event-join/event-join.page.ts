import { Component, OnInit } from '@angular/core';
import { PopoverController,MenuController, ModalController, ToastController, NavController,Platform, Events} from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../service/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { MainService } from '../main.service';


@Component({
  selector: 'app-event-join',
  templateUrl: './event-join.page.html',
  styleUrls: ['./event-join.page.scss'],
})
export class EventJoinPage implements OnInit {

  sliderOpts = {
    speed: 500,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
  };
  backButtonSubscription;
  eventindex:any;
  eventdetails:any = {};
  slideimages:any;
  mapLink: any;
  urlData:any;
  url:any;
  userData: any = {};
  isBookMarked = false;
  disableEnquiry = false;
  peopleGoing:any;
  peopleCount:any;
  goingImage1:any;
  goingImage2:any;
  goingImage3:any;
  goingFlag:boolean = false;

  constructor(
    public apiService: ApiService,
    private activateroute: ActivatedRoute, 
    private router: Router,
    private toastCtrl: ToastController, 
    private navCtrl: NavController,
    private iab: InAppBrowser,
    public mainService: MainService,
    private menuCtrl: MenuController,
    private socialSharing: SocialSharing,
    private platForm: Platform,
    private nativePageTransitions: NativePageTransitions) {

    this.backButtonSubscription = this.platForm.backButton.subscribe(async () => {
          this.router.navigate(['/event-cards'])
    });

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);    
   }

  ngOnInit() {
    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.eventdetails = JSON.parse(params.data);
        this.urlData = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/event/" + this.eventdetails._id;
        this.slideimages = this.eventdetails.image;
        console.log(this.eventdetails);
        console.log(this.slideimages);
      }
      if (params && params.route) {
        this.url = params.route;
        console.log(this.url);
      }
    });
    this.mapLink = "geo:?q=" + this.eventdetails.location.lat + ',' + this.eventdetails.location.lng + "&z=" + 17;

    this.checkbookmark();
    this.getJoinEventstatus();
    this.getAllJoinedEvents(this.eventdetails._id);
  }

    ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 300
    }

    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true)
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 300
    }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }

  closeModal(){
    if(this.url === 'newsfeed'){
      this.navCtrl.navigateBack('/social/tabs/newsfeed');
    }else{
      this.navCtrl.navigateBack('/event-cards');
    }
  }

  checkbookmark(){
    var data = {
       eventId: this.eventdetails._id, 
       userId: this.userData.id 
    }
    this.apiService.checkBookmarked(data).subscribe(res => {
      let result = res;
      console.log(result);
      if (result.flag == 1) {
        this.isBookMarked = true;
      } else {
        this.isBookMarked = false;
      }
    })
  }

  async presentToast(param) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

  redirectMap() {
    this.iab.create(this.mapLink, '_system')
    // window.location = this.mapLink;
    // window.open(this.mapLink, '_system');
  }

  shareLink(value: any) {
    this.socialSharing.share(this.urlData).then((res) => {
      console.log(res);
      //Success
    }).catch((e) => {
      //error
    })
  }

  bookMarkEvent() {
    let data = {
      userId: this.userData.id,
      eventId: this.eventdetails._id,
      date: new Date()
    };
    this.apiService.bookMarkEvent(data).subscribe(res => {
    this.isBookMarked = true;
    this.presentToast('Event Bookmarked');
    console.log(res)
    })
  }

  unBookMarkEvent() {
    this.apiService.removeBookmarked({ eventId: this.eventdetails._id, userId: this.userData.id }).subscribe(res => {
      console.log("Remove bookmark successfully", res)
      this.presentToast('Bookmark Removed');
      if (res.error == false) {
        this.isBookMarked = false
        } else {
        this.isBookMarked = true
      }
    })
  }

  JoinEvent(){
    console.log(this.eventdetails);
    let data = {
      UserId: this.userData.id,
      eventId: this.eventdetails._id,
      ownerId: this.eventdetails.userId,
      eventParentId: this.eventdetails.userId,
      userName: this.userData.userName,
      eventImage: this.eventdetails.image[0].file,
      eventName: this.eventdetails.eventName,
      eventStartTime: this.eventdetails.startTime,
      joinedBy: this.userData.id,
      joinedDate: new Date()
    };

    console.log(data);
    this.apiService.joinEvent(data).subscribe(res => {
      console.log(res);
      this.presentToast('Event Joined Successfully');
      this.navCtrl.navigateBack('/event-cards');
    })
  }

  getJoinEventstatus() {
    this.disableEnquiry = false;
    this.apiService.getJoinEventstatus(this.userData.id, this.eventdetails._id).subscribe(res => {
      let response = res;
      console.log(response);
      if (response.status) {
        this.disableEnquiry = true;
      } else {
        this.disableEnquiry = false;
      }
    })
  }

  getAllJoinedEvents(eventid) {
    this.goingFlag = false;
    console.log(this.goingFlag);
    this.apiService.getAllJoinedEvents(eventid).subscribe(res => {
      console.log(res);
      if(res.count == 0){
        this.goingFlag = true;
      }else{
        this.goingFlag = false;
      }
      console.log(this.goingFlag);
      this.peopleGoing = res.result;
      this.peopleCount = res.result.length;
      this.goingImage3 = this.peopleGoing[0].joinedBy.profileImage;
      this.goingImage2 = this.peopleGoing[1].joinedBy.profileImage;
      this.goingImage1= this.peopleGoing[2].joinedBy.profileImage;
      console.log(this.peopleGoing);
      console.log(this.goingImage3);
      console.log(this.goingImage2);
      console.log(this.goingImage1);
    })
  }

  joinPage(){
    console.log(this.eventdetails);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        eventId: JSON.stringify(this.eventdetails._id)
      }
    };
    this.router.navigate(['peoplejoinedpage'],navigationExtras);
  }



}
