import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,ToastController, ModalController, NavParams  } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import { ApiService } from '../service/api.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';

@Component({
  selector: 'app-allusersmodal',
  templateUrl: './allusersmodal.page.html',
  styleUrls: ['./allusersmodal.page.scss'],
})
export class AllusersmodalPage implements OnInit {

  eventdata:any = {};
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

  constructor(
  	private navParams: NavParams,
    public modalCtrl: ModalController,
  	private activateroute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions, 
    public apiService: ApiService,
    public mainService: MainService,
    public loadingController: LoadingController,
    public toastController: ToastController) {

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
    this.userData = JSON.parse(localStorage.getItem("userData"))

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.eventdata = JSON.parse(params.data);
      }
    });
 }

  ngOnInit() {
    this.getUserbyid(this.userData.id)
    // this.isLoading = true;
    this.getAllUsers();
    this.socket.on('refreshPage', ()=>{
       this.getAllUsers();
    })

  }

  ionViewWillEnter() {
    this.view = '/social/tabs/allusersmodal';
    console.log(this.view);
    this.socket.emit('refresh', {});
    console.log(this.eventUrl);
  }

  closeModal(){
  	this.modalCtrl.dismiss();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  // ionViewDidEnter() {
  //   this.socket.emit('refresh', {});
  // }


  getAllUsers(){
    this.apiService.getAllusers().subscribe(res => {
    console.log(res);
    if(res.error == false){
      this.isLoading = false;
    }
    this.allUsers = res.result;
    console.log(this.allUsers);
    this.filterusers = res.result;
    })
  }

    getUserbyid(userid){
	    this.apiService.getUserById(userid).subscribe(res => {
		  this.userArr = res['result']['following'];
	   	  console.log(this.userArr);
	      console.log(res);
	    })
  	}

  searchfilter(event){
    const val = event.target.value.toLowerCase();
    const filter = this.filterusers.filter(function(d) {
    return d.fullName.toLowerCase().indexOf(val) !== -1;
    });
    this.allUsers = filter;
    this.allUsers.offset = 0;
  }

  CheckInArray(arr, id){
    const result = _.find(arr, ['userFollowed._id',id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = true;
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 500,
      cssClass: 'custom-loading'
    });
    return await loadingElement.present();
  }

  async dismiss() {
    this.loading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  onClear(e){
    console.log(e);
    this.socket.emit('refresh', {});
  }

  FollowUser(user){
  	console.log(user);
  	console.log(user._id);
  	var data = {
		userFollowed: user._id,
		UserId: this.userData.id,
    userName: this.userData.userName,
    notificationType: 'userfollow'
  	}
  	console.log(data);
  	this.apiService.FollowUser(data).subscribe(res => {
    	// this.socket.emit('refresh', {});
       this.getUserbyid(this.userData.id)
  		console.log(res);
  	})
  }

  UnFollowUser(user){
		console.log(user);
	  	console.log(user._id);
	  	var data = {
			userFollowed: user._id,
			UserId: this.userData.id,
      notificationType: 'userfollow'
	  	}
	  	console.log(data);
		this.apiService.UnFollowUser(data).subscribe(res => {
  		// this.socket.emit('refresh', {});
     this.getUserbyid(this.userData.id)
		console.log(res);
		})	
	}

	onProfileClick(user) {
		console.log(user);
	    let navigationExtras: NavigationExtras = {
	      queryParams: {
	        data: JSON.stringify(user),
          route: JSON.stringify(this.view)
	      }
	    };
	    this.closeModal();
	    this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
	  }

}
