import { Component, OnInit, ViewChild} from '@angular/core';
import { IonContent, NavController, Platform, PopoverController,ModalController,ToastController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { PopoverComponent } from '../popover/popover.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';
import { PostmodalPage } from '../postmodal/postmodal.page';

@Component({
  selector: 'app-followhoomanprofile',
  templateUrl: './followhoomanprofile.page.html',
  styleUrls: ['./followhoomanprofile.page.scss'],
})
export class FollowhoomanprofilePage implements OnInit {

  backButtonSubscription;
  userData: any = {};
  allposts:any = [];
  thoughtpost:any = [];
  imagevideo:any = [];
  taggedPost:any = [];
  famjam:any = [];
  socket:any;
  userdetails:any;
  allpets:any = [];
  userArr:any = [];
  userId:any = [];
  pets:any;
  followers:any;
  following:any;
  followflag:boolean = false;
  modal: any;
  view:any;
  url:any;
  likeUnlikeImage:any = 'assets/icon/heart-outline.svg';
  LikedPosts:any;
  bookmarkedPosts:any;
  allLikes:any;
  data:boolean = true;

  @ViewChild(IonContent,{static: false}) content: IonContent;

  constructor(
  	private navCtrl: NavController, 
    private platform: Platform, 
    private socialSharing: SocialSharing,
    private activateroute: ActivatedRoute, 
    private nativePageTransitions: NativePageTransitions, 
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,  
    public popoverController: PopoverController,
    public apiService: ApiService) { 

    this.thoughtpost = this.thoughtpost.map(item => ({
      ...item,
      showMore: false
    }));

  	this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/social/tabs/newsfeed');
    });

    this.activateroute.queryParams.subscribe(params => {
		if (params && params.data) {
			this.userdetails = JSON.parse(params.data);
			this.userArr = this.userdetails.following;
			this.userId = this.userdetails._id
			console.log(this.userdetails);
			console.log(this.userId);
		}
    if (params && params.route) {
      this.url = JSON.parse(params.route);
      console.log(this.url);
    }
	});
  }

  	ngOnInit() {
		this.userData = JSON.parse(localStorage.getItem("userData"));
		console.log(this.userData);
		this.socket.on('refreshPage', ()=>{
      this.getallLikes();
		})
	}

  trimString(string, length) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  getAllPetsbyId(id){
    this.apiService.getpetsByUserId(id).subscribe(res => {
      this.allpets = res['result'];
      this.getUserbyid(this.userId);
      console.log(this.allpets);
      console.log(this.pets);
    })
  }

  ionViewWillEnter() {
    this.thoughtpost = [];
    this.imagevideo = [];
    this.famjam = [];
    this.allposts = [];
    this.view = '/social/tabs/followhoomanprofile';
    console.log(this.view);
    this.getallLikes();
    this.getlikePosts(this.userData.id);
    this.getPostByuserId(this.userdetails._id);
    this.getTaggedPost(this.userdetails._id);
    this.getAllPetsbyId(this.userdetails._id);
    this.getbookmarkPosts(this.userData.id);
    // this.socket.emit('refresh', {});
    setTimeout(() => {
      this.data = false;
    }, 3000);
  }

  getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
      this.userdetails = res['result']
      this.following = this.userdetails.following.length;
      this.followers = this.userdetails.followers.length;
      this.userArr = res['result']['followers'];

      var petdata = res['result']['petAccess'];
      for(let i=0; i<petdata.length;i++){
        this.allpets = [...this.allpets,petdata[i].petId]
      }
      this.pets = this.allpets.length;
   	  console.log(this.userArr);
      console.log(this.userdetails);
    })
  }

	FollowUser(){
		console.log(this.userdetails);
		var data = {
			userFollowed: this.userdetails._id,
			UserId: this.userData.id,
      userName: this.userData.userName,
      notificationType: 'userfollow'
		}
		console.log(data);
		this.apiService.FollowUser(data).subscribe(res => {
		console.log(res);
      this.getUserbyid(this.userId);
  		// this.socket.emit('refresh', {});
		})	
	}

	UnFollowUser(){
		console.log(this.userdetails);
		var data = {
			userFollowed: this.userdetails._id,
			UserId: this.userData.id,
      notificationType: 'userfollow'
		}
		console.log(data);
		this.apiService.UnFollowUser(data).subscribe(res => {
		console.log(res);
    this.getUserbyid(this.userId);
  		// this.socket.emit('refresh', {});
		})	
	}

  CheckInArray(arr, id){
    const result = _.find(arr, ['follower._id',id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }


  doRefresh(event) {
    console.log('Begin async operation');
    this.getUserbyid(this.userId);
	  this.getAllPetsbyId(this.userdetails._id);
    this.getPostByuserId(this.userdetails._id);
    this.getTaggedPost(this.userdetails._id);
    this.getlikePosts(this.userData.id);
    this.getbookmarkPosts(this.userData.id);
    this.getallLikes();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  scrolltop(){
    this.content.scrollToTop(1500);
  }


async presentPopover(ev: any, data: any) {
  console.log(ev,data);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: {
        "paramTitle": "followhoomanprofile",
        "parentRef": this,
        "data": data
      },
      translucent: true
    });
    return await popover.present();
  }

  onBack(){
    if(this.url === '/social/tabs/newsfeed'){
      this.navCtrl.navigateBack('/social/tabs/newsfeed');
    }
    if(this.url === '/social/tabs/allusersmodal'){
      this.navCtrl.navigateBack('/social/tabs/tab2');
    }
    // if(this.url === '/social/tabs/followunfollow'){
    //   this.navCtrl.navigateBack('/social/tabs/followunfollow');
    // }
  }

	onFollowing(){
		let navigationExtras: NavigationExtras = {
		queryParams: {
			data: JSON.stringify(this.userdetails),
      route: JSON.stringify(this.view)
			}
		};
		this.router.navigate(['/social/tabs/followunfollow'],navigationExtras);
	}

    async viewPets() {
    // this.keyboard.hide()
    this.modal = await this.modalCtrl.create({
      component: PostmodalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramTitle": 'followhoomanprofile',
        "userDetails": this.userdetails
      }
    });
    return await this.modal.present();
  }	

  getPostByuserId(id){
    this.thoughtpost = [];
    this.imagevideo = [];
    this.famjam = [];
    this.allposts = [];
    this.apiService.getPostByUserId(id).subscribe(async res => {
      this.allposts = res['result'];
      console.log(this.allposts);
      for(let i=0; i<this.allposts.length; i++){
        if(this.allposts[i].postType == 'media' && this.allposts[i].isFamJam !== true){
          this.imagevideo = [...this.imagevideo,this.allposts[i]];
        }
        if(this.allposts[i].postType == 'thought'){
          this.thoughtpost = [...this.thoughtpost, this.allposts[i]];
        }
        if(this.allposts[i].isFamJam == true){
          this.famjam = [...this.famjam, this.allposts[i]];
        }
      }
      console.log(this.allposts);
      console.log(this.famjam);
    })
  }

  postDetails(post){
    console.log(post);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(post),
        route: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['/social/tabs/postdetails'],navigationExtras);
  }

  getTaggedPost(id){
    this.taggedPost = [];
    this.apiService.getTaggedPost(id).subscribe(async res => {
      console.log(res);
      var tagpost;
      tagpost = res['result'];
      for(let i=0; i<tagpost.length; i++){
        if(tagpost[i].postType == 'media'){
          this.taggedPost = [...this.taggedPost,tagpost[i]];
          console.log(this.taggedPost);
        }
      }
    })
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

  async presentToast(param:any) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
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
    // this.likescount = res['likes'][0].likes.length;
    // console.log(this.likescount);
    this.getallLikes();
    this.getlikePosts(this.userData.id);
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

  viewLikes(likes){
    console.log(likes);
    let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(likes),
          route: 'followhoomanprofile'
        }
      };
      this.router.navigate(['/social/tabs/likes'],navigationExtras);
  }

}
