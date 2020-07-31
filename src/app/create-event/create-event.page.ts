import { Component, OnInit } from '@angular/core';
import { ActionSheetController,ToastController, ModalController, NavController, MenuController,Platform } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { async } from 'q';
import { Base64 } from '@ionic-native/base64/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router,NavigationExtras,ActivatedRoute} from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { StartPage } from '../start/start.page';
import { Location } from "@angular/common";
declare var google: any;
import * as moment from 'moment';
import * as $ from 'jquery';
import { MainService } from '../main.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {

  current = new Date();
  // eventForm:any = {};
  slidesArray: any = [];
  filesArray: any = [];
  tempFilePath: any;
  myDate:string;
  myTime:string;
  myDateNTime:string;
  photos:any = '';
  base64Image:any;
  eventForm: FormGroup;
  userid:any;
  username:any;
  profileimage:any;
  address: string;
  autocomplete: any = {};
  GoogleAutocomplete: any;
  zone: any;
  autocompleteItems: any = [];
  geocoder: any;
  markers: any = [];
  deviceWidth: any;
  deviceHeight: any;

minDate:any =moment().format();;
maxDate:any;
finishMinDate:any;
profile: any;
userData: any = {};
view:any;
eventUrl:any;
eventTypes:Array<any>;
timeFlag:boolean = false;
starttime:any;
endTime:any;
  constructor(
    private router: Router,
    private actionCtrl: ActionSheetController, 
    private nativePageTransitions: NativePageTransitions,
    private modalCtrl: ModalController,
    public apiService: ApiService,
    private menuCtrl: MenuController,
    private navCtrl: NavController, 
    public platform:Platform, 
    public camera:Camera,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public fb: FormBuilder,
    private location: Location,
    public base64: Base64,
    public filePath: FilePath,
    public file: File,
    public mainService: MainService,
    public transfer: FileTransfer,
    public toastController: ToastController,
    private activateroute: ActivatedRoute) { 

    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.userid = this.userData.id;
    this.profile = this.userData.profileImage;
    console.log(this.userData);
    console.log(this.profile);

    this.platform.ready().then((readySource) => {
      this.deviceWidth = this.platform.width();
      this.deviceHeight = this.platform.height();
    });

    this.eventForm = fb.group({
      'userId':[null],
      'userName':[null],
      'profileImage':[null],
      'postType':[null],
      'eventName': [null, Validators.required],
      'startDate': [null, Validators.required],
      'startTime': [null, Validators.required],
      'endDate': [null, Validators.required],
      'endtime': [null, Validators.required],
      'location': [null, Validators.required],
      'address': [null, Validators.required],
      'addr': [null,Validators.required],
      'about': [null],
      'description': [null, Validators.required],
      'isPrivate': [false]
    });

    // this.eventForm = fb.group({
    //   'userId':[null],
    //   'userName':[null],
    //   'profileImage':[null],
    //   'eventName': [null],
    //   'startDate': [null],
    //   'startTime': [null],
    //   'endDate': [null],
    //   'endtime': [null],
    //   'location': [null],
    //   'address': [null],
    //   'addr': [null],
    //   'about': [null],
    //   'description': [null],
    //   'isPrivate': [false]
    // });

  }

  ngOnInit() {
    this.finishMinDate = moment.utc().startOf('day').format('YYYY-MM-DD');
    this.maxDate = moment.utc().add(50, 'y').format('YYYY-MM-DD');
    this.view = this.router.url;
    console.log(this.view);
    this.getUserbyid(this.userid);

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.slider) {
        this.eventUrl = JSON.parse(params.slider);
        console.log(this.eventUrl)
      }
    });
    this.getEventType();
  }


  getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
      this.username = res.result.fullName;
      this.profileimage = res.result.profileImage;
    })
  }

  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

startDateChanged() {
this.eventForm.controls['startTime'].setValue('');
this.eventForm.controls['endDate'].setValue('');
console.log('date changed',this.eventForm.value.startDate);
      
  if (this.eventForm.value.startDate != '') {
    this.finishMinDate = moment(this.eventForm.value.startDate).format('YYYY-MM-DDTHH:mm');
  }

  if (this.eventForm.value.startDate != '' && this.eventForm.value.endDate != '') {
    if (this.eventForm.value.startDate > this.eventForm.value.endDate) {
      this.eventForm.value.endDate = moment(this.eventForm.value.startDate).format('YYYY-MM-DDTHH:mm');
    } else {
      this.finishMinDate = moment(this.eventForm.value.startDate).format('YYYY-MM-DDTHH:mm');
    }
  }
}

starttimeChanged() {
this.eventForm.controls['endtime'].setValue('');
}

endTimeChanged() {
// this.eventForm.controls['endtime'].setValue('');
if (this.eventForm.value.startDate != null && this.eventForm.value.startTime != null && this.eventForm.value.endDate != null) {
            var date1 = new Date(this.eventForm.value.startDate);
           var year1 = date1.getFullYear();
           var month1 = date1.getMonth()+1;
           var dt1 = date1.getDate();

            if (dt1 < 10) {
              dt1 = 0 + dt1;
            }
            if (month1 < 10) {
              month1 = 0 + month1;
            }

          var startdate = year1+'-' + month1 + '-'+dt1;
          var starttime = moment(this.eventForm.value.startTime).format("HH:mm")

          // var starttime = this.eventForm.value.startTime
          console.log(startdate,starttime);
          var datetimeA = moment(startdate + " " + starttime);
          var EventStarts = datetimeA.format();
          this.starttime = EventStarts;
          console.log(EventStarts);


          var date = new Date(this.eventForm.value.endDate);
           var year = date.getFullYear();
           var month = date.getMonth()+1;
           var dt = date.getDate();

            if (dt < 10) {
              dt = 0 + dt;
            }
            if (month < 10) {
              month = 0 + month;
            }

          var enddate = year+'-' + month + '-'+dt;
          var endtime = moment(this.eventForm.value.endtime).format("HH:mm")
          // var endtime = this.eventForm.value.endtime
          console.log(enddate,endtime);
          var datetimeB = moment(enddate + " " + endtime);
          var EventEnds = datetimeB.format();
          this.endTime = EventEnds;

          console.log(EventEnds);

        if (EventStarts >= EventEnds) {
          console.log('a');
          this.presentToast('End Time cannot be before Start Time');
          this.timeFlag = true;
          console.log(this.eventForm.value);
          // this.eventForm.controls['endtime'].setValue('');
        } if (EventStarts < EventEnds) {
          // this.eventForm.controls['startTime'].setValue(EventStarts);
          // this.eventForm.controls['endtime'].setValue(EventEnds);
          console.log('b');
          this.timeFlag = false;
          console.log(this.eventForm.value);
        }
}else{
      this.presentToast('Please fill start/end date and time');
      // this.eventForm.controls['endtime'].setValue('');
}
console.log(this.timeFlag);

}

  onAdd() {
    // this.selectFile();
  }

  ionViewWillEnter() {
    console.log(this.eventUrl);
    if(this.eventUrl == '/event-invitation'){
        console.log('slide from right');
        var options: NativeTransitionOptions = {
        direction: 'right',
        duration: 300
      }
    }else {
        var options: NativeTransitionOptions = {
        direction: 'left',
        duration: 300
      }
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
    this.menuCtrl.enable(true)
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
  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }

  async selectFile(param: any) {
    console.log(param)
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
            this.takephoto()
        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
            this.openGallery()
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  takephoto() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 1525,
      targetHeight: 720,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((filepath) => {
      console.log(filepath);
      this.tempFilePath = filepath
      this.base64.encodeFile(filepath).then((base64File: string) => {
        // this.base64Image = base64File;
        this.slidesArray.unshift({ file: base64File, type: 'image' })
        console.log(this.slidesArray);
      }, (err) => {
        console.log(err);
      });
      var currentName = filepath.substr(filepath.lastIndexOf('/') + 1);
      var correctPath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      let obj = {
        fullPath: filepath,
        name: this.createFileName()
      }
      this.filesArray.unshift(obj)
      console.log(this.filesArray);
    }, (err) => {
      console.log(err)
    })
  }
  openGallery() {
    this.camera.getPicture({
      quality: 100,
      targetWidth: 1525,
      targetHeight: 720,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          this.base64.encodeFile(filePath).then((base64File: string) => {
            this.slidesArray.unshift({ file: base64File, type: 'image' })
            console.log(this.slidesArray);
          }, (err) => {
            console.log(err);
          });
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      let obj = {
        fullPath: imagePath,
        name: this.createFileName()
      }
      this.filesArray.unshift(obj)
      console.log(this.filesArray);
    }, (err) => {
      console.log(err)
    })
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  lastImage: string = null;
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

  removeItem(position) {
    // if(!this.isEdit){
      console.log(position);
      console.log(this.filesArray);
    this.filesArray.splice(position, 1)
    this.slidesArray.splice(position, 1)
    // } else {
    //   this.slidesArray.splice(position, 1)
      // this.slidesArrayForEdit.splice(position, 1)
      // this.apiService.removeMedia(this.petDetails._id, {profilePics: this.slidesArrayForEdit}).subscribe(res=>{
      // })
    // }
  }

  navigateBack() {
    this.location.back();
  }

  onBack() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['myevents'], navigationExtras);
    // this.navCtrl.navigateBack('/myevents');
  }

  onNextInvitation() {
    this.navCtrl.navigateForward('/event-invitation');
  }

  next(){
    this.onSubmit();
  }

    onSubmit() {

      // if (this.eventForm.valid && this.timeFlag == false) {
      //   this.eventForm.controls['userId'].setValue(this.userid);
      //   this.eventForm.controls['userName'].setValue(this.username);
      //   this.eventForm.controls['profileImage'].setValue(this.profileimage);
      //   this.eventForm.controls['startTime'].setValue(this.starttime);
      //   this.eventForm.controls['endtime'].setValue(this.endTime);
      //   console.log(this.eventForm.value);
      //   console.log(this.filesArray);
      //   var data = JSON.stringify(this.eventForm.value);
      //   var images = JSON.stringify(this.slidesArray);

      // let navigationExtras: NavigationExtras = {
      //   queryParams: {
      //     data: JSON.stringify(this.eventForm.value),
      //     image: JSON.stringify(this.slidesArray),
      //     imgArray: JSON.stringify(this.filesArray)
      //   }
      // };
      //   this.router.navigate(['event-invitation'],navigationExtras);
      // }
      // else {
      //   this.presentToast('Please enter correct time');
      //   console.log("Please enter required fileds")
      // }
       //  var descript = (<HTMLInputElement>document.getElementById('descript')).value;
       //  console.log(descript.length);
       //  if(descript.length >= 100){
       //    if (this.eventForm.valid && this.timeFlag == false) {
       //    this.eventForm.controls['userId'].setValue(this.userid);
       //    this.eventForm.controls['userName'].setValue(this.username);
       //    this.eventForm.controls['profileImage'].setValue(this.profileimage);

       //    console.log(this.eventForm.value.startTime);
       //    console.log(this.eventForm.value.startDate);
       //    console.log(this.eventForm.value.endDate);
       //    console.log(this.eventForm.value.endtime);
       //    console.log(this.eventForm.value);
       //    console.log(this.filesArray);
       //    var data = JSON.stringify(this.eventForm.value);
       //    var images = JSON.stringify(this.slidesArray);

       //  let navigationExtras: NavigationExtras = {
       //    queryParams: {
       //      data: JSON.stringify(this.eventForm.value),
       //      image: JSON.stringify(this.slidesArray),
       //      imgArray: JSON.stringify(this.filesArray)
       //    }
       //  };
       //  this.timeFlag = false;
       //    // this.router.navigate(['event-invitation'],navigationExtras);
       //  }
       //  else {
       //    // this.dismiss();
       //    // this.isLoading = false;
       //    // this.petForm.markAsTouched();
       //    console.log("Please enter required fileds correctly")
       //  }
       //  }else{
       //  this.presentToast('Description should be more than 100 characters');
       // }

    var postType = 'event';
    var descript = (<HTMLInputElement>document.getElementById('descript')).value;
    var textbox = (<HTMLInputElement>document.getElementById('textbox')).value;
    if(this.filesArray && this.filesArray.length > 0){
        if(textbox.length <= 30 && textbox.length >= 4){
          if(descript.length >= 1 && descript.length <= 500){
          if (this.eventForm.valid && this.timeFlag == false) {
          this.eventForm.controls['userId'].setValue(this.userid);
          this.eventForm.controls['userName'].setValue(this.username);
          this.eventForm.controls['profileImage'].setValue(this.profileimage);
          this.eventForm.controls['startTime'].setValue(this.starttime);
          this.eventForm.controls['postType'].setValue(postType);
          this.eventForm.controls['endtime'].setValue(this.endTime);
          console.log(this.eventForm.value);
          console.log(this.filesArray);
          var data = JSON.stringify(this.eventForm.value);
          var images = JSON.stringify(this.slidesArray);

        let navigationExtras: NavigationExtras = {
          queryParams: {
            data: JSON.stringify(this.eventForm.value),
            image: JSON.stringify(this.slidesArray),
            imgArray: JSON.stringify(this.filesArray)
          }
        };
          this.router.navigate(['event-invitation'],navigationExtras);
        }
        else {
          this.presentToast('Please enter correct time');
          console.log("Please enter required fileds")
        }
      }
     else{
          this.presentToast('Description should be more than 100 characters');
        } 
    }
    else{
        this.presentToast('Event name should be more than 3 and less than 30 characters');
    }
    }else{
        this.presentToast('Please add atleast one image');
        console.log('Image not added');
    }
         
    
  }

  modal: any;
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
    const { data } = await this.modal.onDidDismiss();
    console.log(data);
    let location = data.location;
    // let address = location.place + ', ' + location.district + ', ' + location.pincode;
    let tempAddress = location.address.split(',');
    tempAddress.splice(0, 1);
    for (let i = 0; i < tempAddress.length; i++) {
      address += tempAddress[i] + ','
    }
    console.log(location);
    console.log(address);
    this.eventForm.controls['location'].setValue(location)
    this.eventForm.controls['address'].setValue(address)
    console.log(this.eventForm.value);
  }

  getEventType(){
    this.apiService.getallEventType().subscribe(res => {
    console.log(res);
    this.eventTypes = res['result'];
    console.log(this.eventTypes);
    })
  }

}
