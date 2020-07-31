import { Component, OnInit, ViewChild} from '@angular/core';
import { PopoverController, ModalController, ToastController, NavController, IonContent, Events, Platform} from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { ModalPage } from '../modal/modal.page';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScrollHideDirective, ScrollHideConfig } from '../../directives/hide-header.directive';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {trigger,state,style,animate,transition} from '@angular/animations';
import { InViewportMetadata } from 'ng-in-viewport';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import * as moment from 'moment';
import _ from 'lodash';
import io from 'socket.io-client';
import { TruncateModule } from '@yellowspot/ng-truncate';
import 'hammerjs';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-postdetails',
  templateUrl: './postdetails.page.html',
  styleUrls: ['./postdetails.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(150%)' }),
        animate('900ms 300ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ])
  ]
})
export class PostdetailsPage implements OnInit {

  @ViewChild(IonContent, { static: false }) private content: IonContent;
    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 54 };
 
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
  newsfeedData:any = [];
  userDetails:any;
  socket:any;
  data:boolean = true;
  like:boolean = false;
  isSlideUp: boolean;
  isSlideDown: boolean;
  cpos: number;
  userData: any = {};
  filterPost:any;
  bookmarkedPosts:any;
  likeUnlikeImage:any = 'assets/icon/heart-outline.svg';
  url:any;
  view:any;
  postdetails:any;
  allLikes:any;
  LikedPosts:any;

  // tslint:disable-next-line:max-line-length
  constructor(
    public platform:Platform ,
    public apiService: ApiService, 
    public events: Events, 
    private router: Router,
    public statusBar: StatusBar, 
    private activateroute: ActivatedRoute, 
    private socialSharing: SocialSharing,
    private popOverCtrl: PopoverController, 
    private modalController: ModalController,
    private toastCtrl: ToastController,  
    private navCtroller: NavController) { 

  	this.activateroute.queryParams.subscribe(params => {
		if (params && params.data) {
			this.postdetails = JSON.parse(params.data);
			console.log(this.postdetails);
		}
	    if (params && params.route) {
	      this.url = JSON.parse(params.route);
	      console.log(this.url);
	    }
	});

    this.newsfeedData = this.newsfeedData.map(item => ({
      ...item,
      showMore: false
    }));

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
    

    this.platform.ready().then(()=>{
      
    })
  }

  trimString(string, length) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  ionViewWillEnter() {
    this.view = this.router.url;
    console.log(this.view);
    this.socket.emit('refresh', {});
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'newsfeed') { 
            this.content.scrollToTop(1000); 
        } 
    });

    setTimeout(() => {
      this.data = false;
    }, 3000);
}


ionViewDidLeave() {
    this.events.unsubscribe('tabs', () => {} );
}

  doRefresh(event) {
    this.getallLikes();  
    this.getAllPosts();
    this.getlikePosts(this.userData.id);

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
      console.log(res);
      this.userDetails = res.result;
      console.log(this.userDetails);
    })
  }

  onProfileClick(userdetails) {
    console.log(userdetails);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(userdetails),
          route: JSON.stringify(this.view)
        }
      };
      console.log(navigationExtras);
      this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
    }


  logScrolling(scrollTop) {
    console.log(scrollTop);
    if (scrollTop >= 100) {
      this.isSlideUp = true;
      // this.isSlideDown = false;
    }
    console.log(scrollTop);
    this.cpos = scrollTop;
    if (scrollTop < 100  ) {
      // this.isSlideDown = true;
      this.isSlideUp = false;
    }
  }
  ngOnInit() {
    this.getAllPosts();
    this.getUserbyid(this.userData.id);
    this.getbookmarkPosts(this.userData.id);
    this.getallLikes();
    this.getpostbyPostid(this.postdetails._id);
    this.getlikePosts(this.userData.id);

    this.socket.on('refreshPage', data =>{
      // this.getAllPosts();
      
      this.getUserbyid(this.userData.id);
      this.getpostbyPostid(this.postdetails._id);
    })
  }

  getAllPosts(){
    this.apiService.get_all_posts().subscribe(res => {
      console.log(res);
      this.newsfeedData = res['result'];
      this.filterPost = res['result'];
      console.log(this.newsfeedData);
    })
  }

  getpostbyPostid(id){
    this.apiService.getpostbyPostid(id).subscribe(res => {
    console.log(res);
    })
  }

  onUserProfile() {
    // this.navCtroller.navigateForward('/social/tabs/hooman-profile');
  }

  async presentPopover(ev: any, data: any) {
  console.log(ev,data);
    const popover = await this.popOverCtrl.create({
      component: PopoverComponent,
      event: ev,
      componentProps: {
        "paramTitle": "postdetails",
        "parentRef": this,
        "data": data
      },
      translucent: true
    });
    return await popover.present();
  }

  // async presentPopover(ev: any) {
  //   const popover = await this.popOverCtrl.create({
  //     component: PopoverComponent,
  //     event: ev,
  //     componentProps: {
  //       "paramTitle": "newsfeed",
  //       "parentRef": this
  //     },
  //     translucent: true
  //   });
  //   return await popover.present();
  // }

  doSomething(){
    this.like = true;
    setTimeout(() => {
      this.like = false;
    }, 1000);
    console.log('Liked');
  }

  doAnotherThing(){
    console.log('Disliked');
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      // cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  viewEvent(){
    this.navCtroller.navigateForward('event-join');
  }
  
  onhashPost(){
    this.navCtroller.navigateForward('/tabs/tab2');
  }

  async presentToast(param:any) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

  public changeVideoAudio(id: string) {
    let vid: any = document.getElementById('media-' + id);
    vid.muted = !vid.muted;
  }

  onIntersection($event) {
    const { [InViewportMetadata]: { entry }, target } = $event;
    const ratio = entry.intersectionRatio;
    const vid = target;
    ratio >= 0.65 ? vid.play() : vid.pause();
  }

  TimeFromNow(time){
    return moment(time).fromNow()
  }

  onClear(e){
    console.log(e);
    this.socket.emit('refresh', {});
  }

  searchfilter(event){
    const val = event.target.value.toLowerCase();
    console.log(val);
    const filter = this.filterPost.filter(function(d) {
      console.log(d);
     return d.userName.toLowerCase().indexOf(val) !== -1;
    });
    console.log(filter);
    this.newsfeedData = filter;
    console.log(this.newsfeedData);
    this.newsfeedData.offset = 0;
    if(this.newsfeedData.length == 0){
      this.presentToast('Search result not found');
    }
  }

  getbookmarkPosts(id){
    this.apiService.getBookMarkedPosts(id).subscribe(res => {
     console.log(res);
    this.bookmarkedPosts= res.result;
    console.log(this.bookmarkedPosts)
    })
  }

  getlikePosts(id){
    this.apiService.getLikePosts(id).subscribe(res => {
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

  CheckLikeCountInArray(arr, id){
    const result = _.find(arr, ['postId', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  CheckbookmarkInArray(arr, id){
    const result = _.find(arr, ['_id', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  CheckLikeInArray(arr, id){
    const result = _.find(arr, ['_id', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  bookMarkPost(post) {
    console.log(post);
    let data = {
      userId: this.userData.id,
      postId: post._id,
      date: new Date()
    };
    console.log(data);
    this.apiService.bookMarkPost(data).subscribe(res => {
    this.presentToast('Post Bookmarked');
    this.getbookmarkPosts(this.userData.id);
    // this.socket.emit('refresh', {});
    console.log(res)
    })
  }

  unBookMarkPost(post) {
    console.log(post);
    let data = {
      userId: this.userData.id,
      postId: post._id,
      date: new Date()
    };
    console.log(data);
    this.apiService.removeBookmarkedPost(data).subscribe(res => {
      console.log("Remove bookmark successfully", res)
      this.presentToast('Bookmark Removed');
      this.getbookmarkPosts(this.userData.id);
      // this.socket.emit('refresh', {});
    })
  }

    likenewPost(post) {
    console.log(post);
    let data;
    if(post.postMedia.length == 0){
      data = {
        UserId: this.userData.id,
        postId: post._id,
        postParentId: post.userId,
        userName: this.userData.userName,
      }
    }else{
      data = {
        UserId: this.userData.id,
        postId: post._id,
        postParentId: post.userId,
        userName: this.userData.userName,
        postImage: post.postMedia[0].file
      };
    }
    
    console.log(data);
    this.apiService.LikePost(data).subscribe(res => {
    console.log(res);
    this.getallLikes();  
    this.getlikePosts(this.userData.id);
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
      this.getallLikes();  
      this.getlikePosts(this.userData.id);
      // this.socket.emit('refresh', {});
    })
  }

  ChecklikesInArray(arr, Userid){
    // const result = _.find(arr, ['Userid', Userid]);
    // if(result){
    //   return true;
    // }else {
    //   return false;
    // }
    return _.some(arr, {Userid: Userid});
    
  }

  likeUnlike(post){
    var data = {
      postId: post._id,
      UserId: this.userData.id,
    }
    this.apiService.likeUnlikePost(data).subscribe(res => {
      console.log(res);
      if(res.message == 'like'){
        this.likeUnlikeImage = 'assets/icon/heart.svg';
      }if(res.message == 'unlike') {
        this.likeUnlikeImage = 'assets/icon/heart-outline.svg';
      }
      this.socket.emit('refresh', {});
    })
  }



  LikePost(post){
    console.log(post);
    var data = {
      postId: post._id,
      UserId: this.userData.id,
    }
    console.log(data)
    this.apiService.likePost(data).subscribe(res => {
      console.log(res);
      // this.islikedBy = true;
      this.socket.emit('refresh', {});
    })
  }

  unLikePost(post){
    console.log(post);
    var data = {
      postId: post._id,
      UserId: this.userData.id,
    }
    console.log(data)
    this.apiService.removelikePost(data).subscribe(res => {
      console.log("Like Removed successfully", res)
      this.socket.emit('refresh', {});
    })
    console.log('unlike');
  }

  shareLink(value: any) {
    console.log(value);
    var urllink;
    urllink = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/event/"
    this.socialSharing.share(urllink).then((res) => {
      console.log(res);
      //Success
    }).catch((e) => {
      //error
    })
  }

  viewpost(post){
    var data = {
      postId: post._id,
      UserId: this.userData.id,
    }
    this.apiService.viewPost(data).subscribe(res => {
      console.log(res);
    })
  }

 onBack(){
     if(this.url === '/social/tabs/followhoomanprofile'){
      this.navCtroller.navigateBack('/social/tabs/followhoomanprofile');
     }
     if(this.url === '/social/tabs/petprofile'){
      this.navCtroller.navigateBack('/social/tabs/petprofile');
     }
     if(this.url === '/social/tabs/tab2'){
      this.navCtroller.navigateBack('/social/tabs/tab2');
     }
	    // this.navCtrl.navigateBack('/social/tabs/petprofile');
	}

  viewLikes(likes){
    console.log(likes);
    let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(likes),
          route: 'postdetails'
        }
      };
      this.router.navigate(['/social/tabs/likes'],navigationExtras);
  }

}
