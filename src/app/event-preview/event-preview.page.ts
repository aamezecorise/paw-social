import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import io from 'socket.io-client';
import { MainService } from '../main.service';

// import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-event-preview',
  templateUrl: './event-preview.page.html',
  styleUrls: ['./event-preview.page.scss'],
})
export class EventPreviewPage implements OnInit {

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
  userid:any;
  socket:any;
  userDetails:any;
  eventpreviewdata:any = {};
  images:any;
  filesArray:any;
  profile: any;
  userData: any = {};
  Loading = false;
  view:any;

  constructor(
    public apiService: ApiService, 
    private activateroute: ActivatedRoute,
    private router: Router, 
    private toastCtrl: ToastController, 
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions,
    public transfer: FileTransfer,
    public mainService: MainService,
    public loadingController: LoadingController) { 

    if (localStorage.getItem("userData")) {
      this.apiService.isLoggedIn = true;
    }

    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userid = this.userData.id;
    this.profile = this.userData.profileImage;
    console.log(this.userData);
    console.log(this.profile);

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
    
    // this.activateroute.queryParams.subscribe((data)=>{
    //   this.eventpreviewdata = data;
    //   console.log(this.eventpreviewdata);
    // })
    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.eventpreviewdata = JSON.parse(params.data);
        console.log(this.eventpreviewdata);
      }
      if (params && params.image) {
        this.images = JSON.parse(params.image);
        console.log(this.images);
      }
      if (params && params.imgArray) {
        this.filesArray = JSON.parse(params.imgArray);
        console.log(this.filesArray);
      }
      
    });
  }

  ngOnInit() {
    this.view = this.router.url;
    console.log(this.view);
    // Loading = false;
    (<HTMLInputElement>document.getElementById('create')).disabled = false;
  }

  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 250
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
      duration: 250
    }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }

    public uploadImage() {

    (<HTMLInputElement>document.getElementById('create')).disabled = true;
    // Destination URL
    this.presentLoading();
    var url = this.apiService.base_url + "event/event_media";
    console.log(url);
    // File for Upload

    if (this.filesArray.length > 0) {
      for (let i = 0; i < this.filesArray.length; i++) {
        var targetPath = this.filesArray[i].fullPath;
        var fileName = this.filesArray[i].name;
        var options = {
          fileKey: "image",
          fileName: fileName,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params: { 'fileName': fileName }
        };
        console.log(targetPath,fileName,options);
        const fileTransfer: FileTransferObject = this.transfer.create();
        fileTransfer.upload(targetPath, url, options).then(data => {
          console.log("upload response", data)
          if (i == this.filesArray.length - 1) {
              this.onCreateEvent();
          }
        }, (err) => {
          console.log("upload response", err)
        });
      }
    } 
    // else {
    //     this.onCreateEvent();
    // }
  }

  onCreateEvent() {
    console.log(this.eventpreviewdata);
    this.Loading = true;
    this.apiService.createEvent(this.eventpreviewdata).subscribe(res => {
      console.log(res);
      this.Loading = false;
      this.socket.emit('refresh', {});
      this.presentToast();
    })
    this.navCtrl.navigateForward('/event-cards');
  }

  onCreateEventBack() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        slider: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['event-invitation'], navigationExtras);
    // this.navCtrl.navigateForward('/event-invitation');
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Event Created Successfully',
      position: 'bottom',
      duration: 2000
    });
    return await toast.present();
  }

  async presentLoading() {
    this.Loading = true;
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 500,
      cssClass: 'custom-loading'
    });
    return await loadingElement.present();
  }
  async dismiss() {
    this.Loading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

}
