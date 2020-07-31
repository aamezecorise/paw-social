import { Component, OnInit } from '@angular/core';
import { NavController,MenuController, Platform,PopoverController,ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';
import { TruncateModule } from '@yellowspot/ng-truncate';


@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.page.html',
  styleUrls: ['./myevents.page.scss'],
})
export class MyeventsPage implements OnInit {

eventdatalist:any = [];
filterEvent:any;
  data:boolean = true;
  islikedBy:boolean = false;
  userid:any;
  socket:any;
  userDetails:any;
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
  profile: any;
  userData: any = {};
  url:any;
  eventdetails:any;
  eventUrl:any;
  view:any;
  bookmarkedEvents:any;
  comment:any;
  likeUnlikeImage:any = 'assets/icon/heart-outline.svg';
  showEmptyMsg:boolean = false;
  allLikes:any;
  LikedPosts:any;
    // footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    // headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 54 };

  constructor(
    private activateroute: ActivatedRoute, 
    private router: Router, 
    public apiService: ApiService,
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions, 
    private platform: Platform,
    private menuCtrl: MenuController,
    public mainService: MainService,
    private toastCtrl: ToastController, 
    public popoverController: PopoverController,
    private socialSharing: SocialSharing) {



    // if (localStorage.getItem("userData")) {
    //   this.apiService.isLoggedIn = true;
    // }

    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userid = this.userData.id;
    this.profile = this.userData.profileImage;
    console.log(this.userData);
    console.log(this.profile);


    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/tabs/pet-owner');
    });
    
   }

  ngOnInit() {
    setTimeout(() => {
      this.data = false;
    }, 3000);
  	// this.socket.emit('refresh', {});
  	this.getEventbyId(this.userid);
    this.getallLikes();
    this.getlikePosts(this.userData.id);
    this.view = this.router.url;
    console.log(this.view);
    
    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.eventUrl = JSON.parse(params.data);
        console.log(this.eventUrl)
      }
    });

    this.socket.on('refreshPage', ()=>{
      this.getEventbyId(this.userid);
    })

    }

  getEventbyId(id){
  	this.apiService.getEventById(id).subscribe(res => {
      this.eventdatalist= res.result;
      console.log(this.eventdatalist)
      if(this.eventdatalist.length == 0){
          this.showEmptyMsg = true;
      }
      this.filterEvent= res.result;
    })
  }

  doRefresh(event) {
    document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
     searchInput.value = '';
    });
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
	  	this.getEventbyId(this.userid);
    }, 2000);
  }

  ionViewWillEnter() {
    this.getallLikes();
    this.getlikePosts(this.userData.id);
    console.log(this.eventUrl);
    if(this.eventUrl == '/eventbookmark' || this.eventUrl == '/create-event'){
        console.log('slide from right');
        var options: NativeTransitionOptions = {
        direction: 'right',
        duration: 300
      }
    }else {
        var options: NativeTransitionOptions = {
        direction: 'left',
        duration: 300
      }
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
    console.log(this.eventUrl);
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

  onCreateEvent() {
    this.navCtrl.navigateForward('/create-event');
  }

  back() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['event-cards'], navigationExtras);
    // this.navCtrl.navigateBack('tabs/event-cards');
    // this.navCtrl.navigateBack('/event-cards');
  }

    async presentPopover(ev: any, data: any) {
	console.log(ev,data);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: {
        "paramTitle": "myevents",
        "parentRef": this,
        "data": data
      },
      translucent: true
    });
    return await popover.present();
  }

  onCardClick(event) {
    var data = {
      eventid: event._id,
      UserId: this.userData.id,
    }
    this.apiService.viewEvent(data).subscribe(res => {
      console.log(res);
    })

    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(event)
      }
    };
    this.router.navigate(['event-join'],navigationExtras);
  }

 searchfilter(event){
    const val = event.target.value.toLowerCase();
    const filter = this.filterEvent.filter(function(d) {
    return d.eventName.toLowerCase().indexOf(val) !== -1;
    });
    this.eventdatalist = filter;
    this.eventdatalist.offset = 0;
    if(this.eventdatalist.length == 0){
      this.presentToast('Search result not found');
    }
  }

  onClear(e){
    console.log(e);
    this.socket.emit('refresh', {});
  }

  likeUnlike(event){
    var data = {
      eventid: event._id,
      UserId: this.userData.id,
    }
    this.apiService.likeUnlikeEvent(data).subscribe(res => {
      console.log(res);
      if(res.message == 'like'){
        this.likeUnlikeImage = 'assets/icon/heart.svg';
      }if(res.message == 'unlike') {
        this.likeUnlikeImage = 'assets/icon/heart-outline.svg';
      }
      this.socket.emit('refresh', {});
    })
  }

    LikePost(event){
    console.log(event._id);
    var data = {
      eventid: event._id,
      UserId: this.userData.id,
      UserName: this.userData.fullName
    }
    console.log(data)
    this.apiService.likeEvent(data).subscribe(res => {
      console.log(res);
      this.islikedBy = true;
      this.socket.emit('refresh', {});
    })
  }

  unLikePost(event){
    console.log(event);
    this.apiService.removelike({ eventId: event._id, UserId: this.userData.id }).subscribe(res => {
      console.log("Like Removed successfully", res)
      this.socket.emit('refresh', {});
      if (res.error == false) {
        this.islikedBy = false
        } else {
        this.islikedBy = true
      }
    })
    console.log('unlike');
  }


  bookmarkpage(){
    this.navCtrl.navigateForward('/eventbookmark');
  }

  shareLink(value: any) {
    console.log(value);
    this.eventdetails = value;
    this.url = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/event/" + this.eventdetails._id;
    this.socialSharing.share(this.url).then((res) => {
      console.log(res);
      //Success
    }).catch((e) => {
      //error
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

  getbookmarkEvents(id){
    this.apiService.getBookMarkedEvents(id).subscribe(res => {
     console.log(res);
    this.bookmarkedEvents= res.result;
    console.log(this.bookmarkedEvents)
    })
  }

  bookMarkEvent(event) {
    console.log(event);
    let data = {
      userId: this.userData.id,
      eventId: event._id,
      date: new Date()
    };
    this.apiService.bookMarkEvent(data).subscribe(res => {
    this.presentToast('Event Bookmarked');
    this.socket.emit('refresh', {});
    console.log(res)
    })
  }

  unBookMarkEvent(event) {
    console.log(event);
    this.apiService.removeBookmarked({ eventId: event._id, userId: this.userData.id }).subscribe(res => {
      console.log("Remove bookmark successfully", res)
      this.presentToast('Bookmark Removed');
      this.socket.emit('refresh', {});
    })
  }

  addcomment(event){
    console.log(event);
    if(this.comment == null){
      this.presentToast('Please add some comment');
    }else {
        var data = {
        eventid: event._id,
        userId: this.userData.id,
        userName: this.userData.fullName,
        comment: this.comment
      }
      console.log(data);
      this.apiService.addCommentEvent(data).subscribe(res => {
        console.log(res);
        this.comment = '';
        this.socket.emit('refresh', {});
      })
    }
    
  }

  viewComments(event){
    console.log(event);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(event)
      }
    };
    this.router.navigate(['eventcomments'], navigationExtras);
    // this.navCtrl.navigateForward('/eventcomments');
  }

    CheckbookmarkInArray(arr, id){
    const result = _.find(arr, ['_id', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  ChecklikeInArray(arr, id){
    console.log(arr,id);
    const result = _.find(arr, ['', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }


  CheckInLikesArray(arr, id){
    return _.some(arr, id)
  }

  CheckLikeCountInArray(arr, id){
    const result = _.find(arr, ['postId', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  getlikePosts(id){
    this.apiService.getLikeEvents(id).subscribe(res => {
     console.log(res);
    this.LikedPosts= res.result;
    console.log(this.LikedPosts)
    })
  }


  getallLikes(){
    this.allLikes = [];
    this.apiService.getallLikes().subscribe(res => {
     console.log(res);
     this.allLikes = res['result'];
     console.log(this.allLikes);
    })
  }

  likenewPost(post) {
    console.log(post);
    let data;
      data = {
        UserId: this.userData.id,
        postId: post._id,
        postParentId: post.userId,
        userName: this.userData.userName,
        postImage: post.image[0].file
      };
    
    console.log(data);
    this.apiService.LikePost(data).subscribe(res => {
    console.log(res);
    this.getlikePosts(this.userData.id);
    this.getallLikes();
    // this.likescount = res['likes'][0].likes.length;
    // console.log(this.likescount);
    // this.socket.emit('refresh', {});
    })
  }

  unlikenewPost(post) {
    console.log(post);
    let data = {
      UserId: this.userData.id,
      postId: post._id,
      postParentId: post.userId,
    };
    console.log(data);
    this.apiService.removeLikePost(data).subscribe(res => {
      console.log(res);
      this.getlikePosts(this.userData.id);
      this.getallLikes();
      // this.socket.emit('refresh', {});
    })
  }

  CheckLikeInArray(arr, id){
    const result = _.find(arr, ['_id', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }


}