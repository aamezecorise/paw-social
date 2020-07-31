import { Component, OnInit, ViewChild,Renderer2,Input,Renderer} from '@angular/core';
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
import { Keyboard } from '@ionic-native/keyboard/ngx';
import * as moment from 'moment';
import _ from 'lodash';
import io from 'socket.io-client';
import { TruncateModule } from '@yellowspot/ng-truncate';
import 'hammerjs';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
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
export class NewsfeedPage implements OnInit {
    @ViewChild(IonContent, { static: false }) private content: IonContent;
    @Input('header') header:any;
    footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: 20 };
    headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 56 };
 
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
  LikedPosts:any;
  likeUnlikeImage:any = 'assets/icon/heart-outline.svg';
  url:any;
  view:any;
  comment:any;
  likescount:any;
  allLikes:any;
  eventdatalist:any = [];

  // tslint:disable-next-line:max-line-length
  constructor(
    public platform:Platform ,
    public apiService: ApiService, 
    public events: Events, 
    private router: Router,
    public statusBar: StatusBar, 
    private socialSharing: SocialSharing,
    private popOverCtrl: PopoverController, 
    private modalController: ModalController,
    private toastCtrl: ToastController,  
    private renderer2: Renderer2,
    private renderer: Renderer,
    public keyboard: Keyboard,
    private navCtroller: NavController) { 

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

    window.onclick = function(event) {
      var fabs = document.querySelectorAll('ion-fab');
      for (var i = 0; i < fabs.length; i++) {
        fabs[i].activated = false;
      }
    }
  }

  trimString(string, length) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  lastX:any;
  logScrolling(event){
    if(event.detail.scrollTop > Math.max(0, this.lastX)){
        this.renderer.setElementStyle(this.header, "opacity", "0")
        this.renderer.setElementStyle(this.header, "webkitTransition", "opacity 500ms")
    }else{
        this.renderer.setElementStyle(this.header, "opacity", "1")
    }
    this.lastX = event.detail.scrollTop
  }

  scrollStart(header){
    this.header = header.el;
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.data = false;
    }, 3000);
    this.view = this.router.url;
    console.log(this.view);
    this.getbookmarkPosts(this.userData.id);
    // this.socket.emit('refresh', {});
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'newsfeed') { 
            this.content.scrollToTop(1000); 
        } 
    });
}


ionViewDidLeave() {
    this.events.unsubscribe('tabs', () => {} );
}

  doRefresh(event) {
    this.allLikes = [];
    this.newsfeedData = [];
    this.getAllPosts();
    this.getlikePosts(this.userData.id);
    this.getbookmarkPosts(this.userData.id);
    this.getallLikes();
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

  onUserProfileClick(userdetails) {
    console.log(userdetails);
      // let navigationExtras: NavigationExtras = {
      //   queryParams: {
      //     data: JSON.stringify(userdetails),
      //     route: JSON.stringify(this.view)
      //   }
      // };
      // console.log(navigationExtras);
      // this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
    }


  // logScrolling(scrollTop) {
  //   console.log(scrollTop);
  //   if (scrollTop >= 100) {
  //     this.isSlideUp = true;
  //     // this.isSlideDown = false;
  //   }
  //   console.log(scrollTop);
  //   this.cpos = scrollTop;
  //   if (scrollTop < 100  ) {
  //     // this.isSlideDown = true;
  //     this.isSlideUp = false;
  //   }
  // }
  ngOnInit() {
    this.allLikes = [];
    this.newsfeedData = [];
    this.getAllPosts();
    this.getUserbyid(this.userData.id);
    this.getbookmarkPosts(this.userData.id);
    this.getlikePosts(this.userData.id);
    this.getallLikes();
    // this.CheckLikeCountInArray(this.allLikes, id);
    this.socket.on('refreshPage', data =>{
      // this.getAllPosts();
      this.getUserbyid(this.userData.id);
      this.getAllPosts();
    })
    // this.socket.emit('refresh', {});
  }

  getAllPosts(){
    this.apiService.get_all_posts().subscribe(res => {
      console.log(res);
      this.newsfeedData = res['result'];
      this.filterPost = res['result'];
      // this.getallEvents();
      this.newsfeedData.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.createdAt - a.createdAt;
      })

      console.log(this.newsfeedData);
    })
  }

  onUserProfile() {
    // this.navCtroller.navigateForward('/social/tabs/hooman-profile');
  }

  async presentPopover(ev: any, data: any) {
    console.log(ev,data);
    var reportdata = {
      userId: this.userData.id,
      postId: data._id,
      postParentId: data.userId
    }
    console.log(reportdata);
    const popover = await this.popOverCtrl.create({
      component: PopoverComponent,
      event: ev,
      componentProps: {
        "paramTitle": "newsfeed",
        "parentRef": this,
        "data": reportdata
      },
      translucent: true
    });
    return await popover.present();
  }

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
    console.log(id);
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

  // getLikePosts(id): Observable<any> {
  //   return this.http.get(environment.getlikePostsUrl + "/" + id)
  // }
  // checkLikedPost(param:any): Observable<any> {
  //   return this.http.post(environment.checklikedPostsUrl, param)
  // }

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
      this.socket.emit('refresh', {});
      if(res.message == 'like'){
        this.likeUnlikeImage = 'assets/icon/heart.svg';
      }if(res.message == 'unlike') {
        this.likeUnlikeImage = 'assets/icon/heart-outline.svg';
      }
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

  viewComments(data){
    console.log(data);
    let commentsview;

    if(data.postMedia[0]){
        commentsview = {
        profileImage: data.profileImage,
        caption: data.caption,
        userName: data.userName,
        userId: data.userId,
        notificationType: 'post',
        media: data.postMedia[0].file,
        _id: data._id
      }
    }else{
        commentsview = {
        profileImage: data.profileImage,
        caption: data.thought,
        userName: data.userName,
        userId: data.userId,
        notificationType: 'thought',
        _id: data._id
      }
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(commentsview),
        route: 'newsfeed'
      }
    };
    this.router.navigate(['eventcomments'], navigationExtras);
  }

  addcomment(post){
    console.log(post);
    let data;
    if(this.comment == null){
      this.presentToast('Please add some comment');
    }else {

      if(post.postMedia[0]){
        data = {
          postId: post._id,
          userId: this.userData.id,
          userName: this.userData.fullName,
          comment: this.comment,
          postParentId: post.userId,
          postImage: post.postMedia[0].file
        }
    }else{
      data = {
        postId: post._id,
        userId: this.userData.id,
        userName: this.userData.fullName,
        comment: this.comment,
        postParentId: post.userId
      }
    }
      console.log(data);
      this.apiService.addCommentPost(data).subscribe(res => {
        console.log(res);
        this.comment = '';
        this.getAllPosts();
        // this.socket.emit('refresh', {});
      })
    }
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

  keyboardCheck() {
    return !this.keyboard.isVisible;
  }

  viewLikes(likes){
    console.log(likes);
    let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(likes),
          route: 'newsfeed'
        }
      };
      this.router.navigate(['/social/tabs/likes'],navigationExtras);
  }

  // getallEvents(){
  //   this.apiService.getEvent().subscribe(res => {
  //     console.log(res);
  //     var eventdata = res['data'];
  //   for(let i=0;i<eventdata.length;i++){
  //     this.newsfeedData = [...this.newsfeedData,eventdata[i]];
  //   }
  //   console.log(eventdata);
  //   console.log(this.newsfeedData);
  //   })
  // }

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
        data: JSON.stringify(event),
        route: 'newsfeed'
      }
    };
    this.router.navigate(['event-join'],navigationExtras);
  }

}


