import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,ToastController, ModalController,AlertController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import { ApiService } from '../service/api.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';

@Component({
  selector: 'app-petfollowers',
  templateUrl: './petfollowers.page.html',
  styleUrls: ['./petfollowers.page.scss'],
})
export class PetfollowersPage implements OnInit {

  allUsers:any;
  isLoading = true;
  loading = false;
  socket:any;
  view:any;
  userData: any = {};
  userArr:any = [];
  petDetails:any;
  followers:any = [];
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
    console.log(this.userData);

	this.activateroute.queryParams.subscribe(params => {
      if (params.data) {
        this.petDetails = JSON.parse(params.data);
        console.log(this.petDetails);
      }
      if (params.route) {
        this.url = JSON.parse(params.route);
        console.log(this.url);
      }
    });
    }

  ngOnInit() {
  	this.getPetById();
  	this.socket.on('refreshPage', ()=>{
  		this.getPetById();
    })
  }

    doRefresh(event) {
  		this.getPetById();
	    setTimeout(() => {
	      event.target.complete();
	    }, 2000);
	 }

   ionViewWillEnter() {
    this.socket.emit('refresh', {});
  }
	

   onBack(){
     if(this.url === '/social/tabs/followhoomanprofile'){
      this.navCtrl.navigateBack('/social/tabs/petprofile');
     }
     if(this.url === '/social/tabs/pet-owner'){
      this.navCtrl.navigateBack('/social/tabs/petprofile');
     }
	    // this.navCtrl.navigateBack('/social/tabs/petprofile');
	}

  getPetById(){
    var id = this.petDetails._id;
    this.apiService.getpetbyid(id).subscribe(res => {
    	console.log(res);
		this.followers = res['result']['followers'];
	    console.log(this.followers);
    })  
  }

  removeFollower(pet){
      console.log(pet);
      console.log(this.petDetails._id);
      console.log(pet.follower._id);
      this.data = {
        UserId: pet.follower._id,
        petId: this.petDetails._id
      }
      var userName = pet.follower.fullName
      this.unfollowpetAlert('Are you sure you want to remove ' + userName)
      console.log(this.data);
      
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

}
