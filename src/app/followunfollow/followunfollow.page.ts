import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,ToastController, ModalController,AlertController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import { ApiService } from '../service/api.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';

@Component({
  selector: 'app-followunfollow',
  templateUrl: './followunfollow.page.html',
  styleUrls: ['./followunfollow.page.scss'],
})
export class FollowunfollowPage implements OnInit {

  images:any;
  imgArray:any;
  allUsers:any;
  filterusers:any;
  invitations:any = [];
  isLoading = true;
  loading = false;
  socket:any;
  view:any;
  eventUrl:any;
  userData: any = {};
  userArr:any = [];
  userDetails:any;
  followers:any = [];
  following:any = [];
  data:any;
  url:any;

  constructor(
    public modalCtrl: ModalController,
  	private activateroute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions, 
    public apiService: ApiService,
    public mainService: MainService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController) {

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
    this.userData = JSON.parse(localStorage.getItem("userData"))

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.userDetails = JSON.parse(params.data);
        console.log(this.userDetails);
      }
      if (params && params.route) {
        this.url = JSON.parse(params.route);
        console.log(this.url);
      }
    });

    }

  ngOnInit() {
    this.getUserbyid(this.userDetails._id)
  	this.socket.on('refreshPage', ()=>{
       this.getUserbyid(this.userDetails._id)
    })
  }

  onBack(){
    if(this.url === '/social/tabs/followhoomanprofile') {
      this.navCtrl.navigateBack('/social/tabs/followhoomanprofile');
    }
  }

   getUserbyid(userid){
	    this.apiService.getUserById(userid).subscribe(res => {
    	console.log(res['result']);
	    this.userArr = res['result']['following'];
    	this.followers = res['result']['followers'];
        this.following = res['result']['following'];
        console.log(this.followers);
        console.log(this.following);
	   	console.log(this.userArr);
	    })
  	}

  	onProfileClickfollowing(user) {
		console.log(user.userFollowed);
	    let navigationExtras: NavigationExtras = {
	      queryParams: {
	        data: JSON.stringify(user.userFollowed),
          // route: JSON.stringify(this.view)
	      }
	    };
	    this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
	  }

    onProfileClickfollower(user) {
    console.log(user.follower);
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(user.follower),
          // route: JSON.stringify(this.view)
        }
      };
      this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
    }

    CheckInArray(arr, id){
	    const result = _.find(arr, ['userFollowed._id',id]);
	    if(result){
	      return true;
	    }else {
	      return false;
	    }
    }

  ionViewWillEnter() {
    this.socket.emit('refresh', {});
    this.view = '/social/tabs/followunfollow';
    console.log(this.view);
  }

    async unfollowpetAlert(param) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: param,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.apiService.UnFollowPet(this.data).subscribe(res => {
              console.log(res);
                this.socket.emit('refresh', {});
              })  
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

    async unfollowuserAlert(param) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: param,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.apiService.UnFollowUser(this.data).subscribe(res => {
              this.socket.emit('refresh', {});
            console.log(res);
            })  
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }


    doRefresh(event) {
       this.getUserbyid(this.userDetails._id)
	    setTimeout(() => {
	      event.target.complete();
	    }, 2000);
	  }

    FollowUser(user){
	  	console.log(user.follower);
	  	console.log(user.follower._id);
	  	var data1 = {
			userFollowed: user.follower._id,
			UserId: this.userDetails._id
	  	}
	  	console.log(data1);
	  	this.apiService.FollowUser(data1).subscribe(res => {
	    	this.socket.emit('refresh', {});
	  		console.log(res);
	  	})
	  }

	  UnFollowUser(user){
			console.log(user.userFollowed);
		  	console.log(user.userFollowed._id);
		  	this.data = {
				userFollowed: user.userFollowed._id,
				UserId: this.userDetails._id
		  	}
		  	console.log(this.data);
		  	var userName = user.userFollowed.fullName
    		this.unfollowuserAlert('Are you sure you want to unfollow ' + userName)
		  }

	  FollowPet(pet){
	    console.log(pet.petFollowed._id);
	    var data = {
	      UserId: this.userData.id,
	      petId: pet.petFollowed._id
	    }
	    console.log(data);
	    this.apiService.FollowPet(data).subscribe(res => {
	    console.log(res);
	      this.socket.emit('refresh', {});
	    })  
	  }

	  UnFollowPet(pet){
	    console.log(pet.petFollowed._id);
	    this.data = {
	      UserId: this.userData.id,
	      petId: pet.petFollowed._id
	    }
	    var petName = pet.petFollowed.petName
    	this.unfollowpetAlert('Are you sure you want to unfollow ' + petName)
	    console.log(this.data);
	    
	  }

}
