import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController, NavParams,ToastController,NavController,LoadingController} from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
declare var google: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  userData: any = {};
  paramTitle: any;
  paramsubTitle:any;
  socket:any;
  view:any;
  isLoading = true;
  parentRef: any;
  Loading = false;
  reportData:any;
  reportMessage:any

  constructor(
  	public router: Router, 
  	private geolocation: Geolocation, 
  	private navParams: NavParams,
  	public apiService: ApiService,
    private toastCtrl: ToastController, 
    private navCtrl: NavController, 
    public transfer: FileTransfer,
    public loadingController: LoadingController,
    private nativeGeocoder: NativeGeocoder, 
    public modalCtrl: ModalController) { 

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
  }

  ngOnInit() {
    this.parentRef = this.navParams.data.parentRef;
    this.paramTitle = this.navParams.data.paramTitle;
    this.paramsubTitle = this.navParams.data.paramsubTitle;
    this.reportData = this.navParams.data.reportDetails;

    console.log(this.paramTitle);
    console.log(this.reportData);
    this.socket.on('refreshPage', ()=>{
    })
    this.view = 'modal';
    console.log(this.view);
  }

  closeModal(){
  	this.modalCtrl.dismiss();
  }

async presentToast(param: any) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

  report(){
  	this.reportData.reportMessage = this.reportMessage;
  	console.log(this.reportData);
  	this.apiService.reportPost(this.reportData).subscribe(res => {
        console.log(res);
        this.closeModal();
        this.presentToast('Post Reported Successfully');
        this.navCtrl.navigateForward('/social/tabs/newsfeed');
      })
  }

}
