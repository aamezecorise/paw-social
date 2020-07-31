import { Component, OnInit } from '@angular/core';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ModalController, Platform, NavController, ToastController,AlertController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { StartPage } from '../start/start.page';
import { PostmodalPage } from '../postmodal/postmodal.page';

declare var google: any;
import io from 'socket.io-client';

@Component({
  selector: 'app-textpost',
  templateUrl: './textpost.component.html',
  styleUrls: ['./textpost.component.scss'],
})
export class TextpostComponent implements OnInit {
  backButtonSubscription;
  textPostData:any = {};
  textForm: FormGroup;
  userData: any = {};
  userid:any;
  profile: any;
  socket: any;
  modal: any;
  userdetails:any;
  taggedArray:any = [];
  characterCounter:any;

  constructor(
    public apiService: ApiService, 
    private toastCtrl: ToastController, 
    private navCtrl: NavController, 
    private cameraPreview: CameraPreview, 
    private modalCtrl: ModalController, 
    private nativePageTransitions: NativePageTransitions, 
    private platform: Platform,
    public fb: FormBuilder,
    private geolocation: Geolocation,
    public alertController: AlertController,
    private nativeGeocoder: NativeGeocoder) { 

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userid = this.userData.id;
    this.profile = this.userData.profileImage;
    console.log(this.userData);
    console.log(this.profile);

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/social/tabs/newsfeed');
    });

    this.textForm = fb.group({
      'userId':[null],
      'userName':[null],
      'profileImage':[null],
      'postType':[null],
      'thought': [null, Validators.required],
      'location': [null],
      'address': [null],
      'addr': [null],
      'tagged': [null],
      'temptagged': [null],
      'postAccount': [null]
    });

    // this.textForm = fb.group({
    //   'userId':[null],
    //   'userName':[null],
    //   'profileImage':[null],
    //   'postType':[null],
    //   'thought': [null],
    //   'location': [null],
    //   'address': [null],
    //   'addr': [null],
    //   'tagged': [null],
    //   'temptagged': [null],
    //   'postAccount': [null]
    // });
  }

  ngOnInit() {
    this.getUserbyid(this.userid);
  }

  // dismiss() {
  //   this.modalCtrl.dismiss();
  // }

  dismiss() {
    this.navCtrl.navigateForward('/social/tabs/newsfeed');
  }

  getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
      this.userdetails = res['result']
    })
  }

  textPost(){
    var postType = 'thought'
    var thought = (<HTMLInputElement>document.getElementById('thought')).value;
    this.characterCounter = thought.length;
    if(thought.length >= 1){
      if (this.textForm.valid) {
          this.textForm.controls['userId'].setValue(this.userid);
          this.textForm.controls['userName'].setValue(this.userData.userName);
          this.textForm.controls['profileImage'].setValue(this.profile);
          this.textForm.controls['postType'].setValue(postType);
          this.textForm.controls['tagged'].setValue(this.taggedArray);
          console.log(this.textForm.value);

          this.postAccount(this.userdetails);

          // this.apiService.add_new_post(this.textForm.value).subscribe(res => {
          // console.log(res);
          // this.socket.emit('refresh', {});
          // this.presentToast('Posted Successfully');
          // this.navCtrl.navigateForward('/social/tabs/newsfeed');
          // })
        }
      else {
        this.presentToast('Please enter all fields');
        console.log("Please enter required fields")
      }
    } 
    else{
        this.presentToast('Thought should be atleast 1 character');
      } 
  }

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
        "paramTitle": 'textpost',
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
      this.textForm.controls['location'].setValue(location)
      this.textForm.controls['address'].setValue(address)
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

      this.textForm.controls['temptagged'].setValue(temptagged)
    }  

    console.log(this.textForm.value);
  }

  async postAccount(data: any) {
    // this.keyboard.hide()
    this.modal = await this.modalCtrl.create({
      component: PostmodalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramTitle": 'textpost',
        "userDetails": this.userdetails,
        "postData": this.textForm.value
      }
    });
    return await this.modal.present();
  }



}
