import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavController, ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { StartPage } from '../start/start.page';
import { PostmodalPage } from '../postmodal/postmodal.page';
declare var google: any;
import io from 'socket.io-client';

@Component({
  selector: 'app-add-new-post',
  templateUrl: './add-new-post.page.html',
  styleUrls: ['./add-new-post.page.scss'],
})
export class AddNewPostPage implements OnInit {

  socket: any;
  photoData:any;
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
  imagePostData:any = {};
  images:any = [];
  videos:any = [];
  filesArray:any;
  postForm: FormGroup;
  userData: any = {};
  userid:any;
  profile: any;
  userdetails:any;
  modal: any;
  taggedArray:any = [];
  posttype:any;
  route:any;

  constructor(
    public apiService: ApiService, 
    private toastCtrl: ToastController, 
    private router: ActivatedRoute,
    private modalCtrl: ModalController, 
    private navCtrl: NavController,
    public fb: FormBuilder,
    private activateroute: ActivatedRoute,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userid = this.userData.id;
    this.profile = this.userData.profileImage;
    console.log(this.userData);
    console.log(this.profile);

    this.activateroute.queryParams.subscribe(params => {
      // if (params && params.data) {
      //   this.eventpreviewdata = JSON.parse(params.data);
      //   console.log(this.eventpreviewdata);
      // }
      if (params && params.image) {
        this.images = JSON.parse(params.image);
        console.log(this.images);
      }if (params && params.video) {
        this.videos = JSON.parse(params.video);
        console.log(this.videos);
      }
      if (params && params.imgArray) {
        this.filesArray = JSON.parse(params.imgArray);
        console.log(this.filesArray);
      }
      if (params && params.postType) {
        this.posttype = params.postType;
        console.log(this.posttype);
      }
      if (params && params.route) {
        this.route = params.route;
        console.log(this.route);
      }
      
    });

    this.postForm = fb.group({
      'userId':[null],
      'userName':[null],
      'profileImage':[null],
      'postType':[null],
      'caption': [null, Validators.required],
      'postMedia': [null],
      'location': [null],
      'address': [null],
      'addr': [null],
      'tagged': [null],
      'temptagged': [null],
      'postAccount': [null],
      'isFamJam': [null]
    });

    // this.postForm = fb.group({
    //   'userId':[null],
    //   'userName':[null],
    //   'profileImage':[null],
    //   'postType':[null],
    //   'caption': [null],
    //   'postMedia': [null],
    //   'videos': [null],
    //   'location': [null],
    //   'address': [null],
    //   'addr': [null],
    //   'tagged': [null],
    //   'temptagged': [null],
    //   'postAccount': [null],
    //   'isFamJam': [null]
    // });

   }

  ngOnInit() {
    this.getUserbyid(this.userid);
  }

  getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
      this.userdetails = res['result'];
      console.log(this.userdetails);
    })
  }

  dismiss(){
    if(this.route == 'camera-preview'){
      this.navCtrl.navigateBack('/camera-preview');
    }
    if(this.route == 'video-preview'){
      this.navCtrl.navigateBack('/video-preview');
    }
  }

  imagePost(){
    var postType = 'media'
    var caption = (<HTMLInputElement>document.getElementById('caption')).value;
    if(caption.length >= 1){
      if (this.postForm.valid) {
          this.postForm.controls['userId'].setValue(this.userid);
          this.postForm.controls['userName'].setValue(this.userData.userName);
          this.postForm.controls['profileImage'].setValue(this.profile);
          this.postForm.controls['postType'].setValue(postType);
          this.postForm.controls['tagged'].setValue(this.taggedArray);
          console.log(this.postForm.value);

          this.postAccount(this.userdetails);
        }
      else {
        this.presentToast('Please enter all fields');
        console.log("Please enter required fields")
      }
    } 
    else{
        this.presentToast('Caption should be atleast 1 characters');
      } 
  }

  // videoPost(){
  //   var postType = 'video'
  //   var caption = (<HTMLInputElement>document.getElementById('caption')).value;
  //   if(caption.length >= 100){
  //     if (this.postForm.valid) {
  //         this.postForm.controls['userId'].setValue(this.userid);
  //         this.postForm.controls['userName'].setValue(this.userData.fullName);
  //         this.postForm.controls['profileImage'].setValue(this.profile);
  //         this.postForm.controls['postType'].setValue(postType);
  //         this.postForm.controls['tagged'].setValue(this.taggedArray);
  //         console.log(this.postForm.value);

  //         this.postAccount1(this.userdetails);
  //       }
  //     else {
  //       this.presentToast('Please enter all fields');
  //       console.log("Please enter required fields")
  //     }
  //   } 
  //   else{
  //       this.presentToast('Caption should be more than 100 characters');
  //     } 
  // }

  async presentToast(param: any) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

  async tagPeople(data: any) {
    // this.keyboard.hide()
    this.modal = await this.modalCtrl.create({
      component: PostmodalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramTitle": 'imagepost',
        "paramsubTitle": 'tagpeople',
        "userDetails": this.userdetails,
        "parentRef": this
      }
    });
    return await this.modal.present();
  }

  async GetLocation() {
    // this.keyboard.hide()
    this.modal = await this.modalCtrl.create({
      component: StartPage,
      componentProps: {
        "parentRef": this
      }
    });
    return await this.modal.present();
  }

    async onDismiss() {
    let address: any = "";
    let temptagged: any = "";
    const { data } = await this.modal.onDidDismiss();
    console.log(data);

    if(data.modalroute === 'locationmodal'){
      let location = data.location;
      
      // let address = location.place + ', ' + location.district + ', ' + location.pincode;
      let tempAddress = location.address.split(',');
        tempAddress.splice(0, 1);
      for (let i = 0; i < tempAddress.length; i++) {
        address += tempAddress[i] + ','
      }
      
      console.log(location);
      console.log(address);
      this.postForm.controls['location'].setValue(location)
      this.postForm.controls['address'].setValue(address)
    }

    if(data.modalroute === 'tagmodal'){
      let tag = data.tagged;
      console.log(tag);
      this.taggedArray = tag;

      for (let i = 0; i < tag.length; i++) {
        console.log(tag[i]['UserName'])
        temptagged += tag[i]['UserName'] + ','
      }
      console.log(temptagged);

      this.postForm.controls['temptagged'].setValue(temptagged)
    }  

    console.log(this.postForm.value);
  }

  async postAccount(data: any) {
    // this.keyboard.hide()
    this.modal = await this.modalCtrl.create({
      component: PostmodalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramTitle": 'imagepost',
        "userDetails": this.userdetails,
        "postData": this.postForm.value,
        "filesArray":this.filesArray
      }
    });
    return await this.modal.present();
  }

  // async postAccount1(data: any) {
  //   // this.keyboard.hide()
  //   this.modal = await this.modalCtrl.create({
  //     component: PostmodalPage,
  //     cssClass: 'dialog-modal',
  //     componentProps: {
  //       "paramTitle": 'videopost',
  //       "userDetails": this.userdetails,
  //       "postData": this.postForm.value,
  //       "filesArray":this.filesArray
  //     }
  //   });
  //   return await this.modal.present();
  // }
  
}
