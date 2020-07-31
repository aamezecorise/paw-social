import { Component, OnInit } from '@angular/core';
import { NavController, Platform,ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';
import { TruncateModule } from '@yellowspot/ng-truncate';

@Component({
  selector: 'app-eventbookmark',
  templateUrl: './eventbookmark.page.html',
  styleUrls: ['./eventbookmark.page.scss'],
})
export class EventbookmarkPage implements OnInit {


  eventdatalist:any = [];
  filterEvent:any;
  data:boolean = true;
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
islikedBy:boolean = false;
url:any;
eventdetails:any;
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
    public mainService: MainService,
    private toastCtrl: ToastController, 
    private socialSharing: SocialSharing) {

    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.profile = this.userData.profileImage;
    console.log(this.userData);
    console.log(this.profile);

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/myevents');
    });
   }

  ngOnInit() {
    setTimeout(() => {
      this.data = false;
    }, 3000);
    this.view = this.router.url;
    console.log(this.view);
    this.socket.emit('refresh', {});
    this.socket.on('refreshPage', ()=>{
      
    })
      this.getbookmarkEvents(this.userData.id);
      this.getbookMarkEvent(this.userData.id);
      this.getallLikes();
      this.getlikePosts(this.userData.id);
  }

  getbookmarkEvents(id){
    this.apiService.getBookMarkedEvents(id).subscribe(res => {
   	console.log(res);
    this.eventdatalist= res.result;
    if(this.eventdatalist.length == 0){
          this.showEmptyMsg = true;
    }
    this.filterEvent= res.result;
    console.log(this.eventdatalist)
    })
  }

  doRefresh(event) {
    this.getallLikes();
    this.getlikePosts(this.userData.id);
    this.getbookmarkEvents(this.userData.id);
    document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
     searchInput.value = '';
    });
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.getallLikes();
    this.getlikePosts(this.userData.id);
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
    this.navCtrl.navigateForward('/myevents');
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

  onBackPetLover() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['myevents'], navigationExtras);


    // this.navCtrl.navigateBack('/myevents');
  }

  searchfilter(event){
    const val = event.target.value.toLowerCase();
    const filter = this.filterEvent.filter(function(d) {
    return d.eventName.toLowerCase().indexOf(val) !== -1 || d.userName.toLowerCase().indexOf(val) !== -1;
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

  getbookMarkEvent(id){
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
    // this.socket.emit('refresh', {});
    this.getbookmarkEvents(this.userData.id);
    this.getbookMarkEvent(this.userData.id);
    this.presentToast('Event Bookmarked');
    console.log(res)
    })
  }

  unBookMarkEvent(event) {
    console.log(event);
    this.apiService.removeBookmarked({ eventId: event._id, userId: this.userData.id }).subscribe(res => {
      console.log("Remove bookmark successfully", res)
      // this.socket.emit('refresh', {});
      this.getbookmarkEvents(this.userData.id);
      this.getbookMarkEvent(this.userData.id);
      this.presentToast('Bookmark Removed');
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
