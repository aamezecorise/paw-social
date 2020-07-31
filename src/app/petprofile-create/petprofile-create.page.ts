import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, LoadingController, MenuController, ModalController, Platform, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Location } from "@angular/common";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Storage } from '@ionic/storage';
import { Breed, Breeds, CatBreed, CatBreeds } from '../demo-data';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { async } from 'q';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { StartPage } from '../start/start.page';
import { toUnicode } from 'punycode';
declare var google: any;
import io from 'socket.io-client';

@Component({
  selector: 'app-petprofile-create',
  templateUrl: './petprofile-create.page.html',
  styleUrls: ['./petprofile-create.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PetprofileCreatePage implements OnInit {
  @ViewChild('primaryComponent',{ static: false }) primaryComponent: IonicSelectableComponent;
  @ViewChild('secondaryComponent',{ static: false }) secondaryComponent: IonicSelectableComponent;

  maxDate = new Date();
  category = null;
  isOpened = false;
  isClickedItem1 = false;
  isClickedItem2 = false;
  breeds: Breed[] = Breeds;
  dogBreeds: any = [];// = Breeds;
  catBreeds: CatBreed[] = CatBreeds;
  isDisplay = false;
  petForm: FormGroup;
  petDetails: any;
  base64Image: any = null;
  base64Profie: any = null;
  userData: any = {};
  isEdit = false;
  deviceWidth: any;
  deviceHeight: any;
  page = 2;
  isLoading = false;
  socket:any;
  dob = '';
  url:any;
  constructor(
    public router: Router, public apiService: ApiService,
    public actionCtrl: ActionSheetController,
    private mediaCapture: MediaCapture,
    private media: Media,
    private storage: Storage,
    public fb: FormBuilder, public camera: Camera,
    public transfer: FileTransfer,
    public filePath: FilePath,
    public toastController: ToastController,
    public file: File,
    private crop: Crop,
    private location: Location,
    public loadingController: LoadingController,
    public route: ActivatedRoute,
    public keyboard: Keyboard,
    private webview: WebView,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    public modalController: ModalController,
    private nativePageTransitions: NativePageTransitions,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platForm: Platform,
    public base64: Base64
  ) { 

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.platForm.ready().then((readySource) => {
      this.deviceWidth = this.platForm.width();
      this.deviceHeight = this.platForm.height();
    });

    this.breeds = []
    this.apiService.getDogBreeds().subscribe(res => {
      console.log(res);
      this.dogBreeds = res['dog_breeds'];
      this.breeds = this.dogBreeds.slice(0, 19)
    })
    this.apiService.getCatBreeds().subscribe(res => {
      console.log(res);
      this.catBreeds = res['cat_breeds'];
    })

    this.petForm = fb.group({
      'category': [null, Validators.required],
      'profileImage': [null, Validators.required],
      'gender': [],
      'primary_breed': [null, Validators.required],
      'secondary_breed': [null],
      'weight': [null, Validators.required],
      'birthday': [null],
      'petName': [null, Validators.required],
      'description': [null],
      'isAdopt': [false],
      'isDelete': [false],
      'userId': [null],
    });

    // this.petForm = fb.group({
    //   'category': [null],
    //   'profileImage': [null],
    //   'gender': [],
    //   'primary_breed': [null],
    //   'secondary_breed': [null],
    //   'weight': [null],
    //   'birthday': [null],
    //   'petName': [null],
    //   'description': [null],
    //   'isAdopt': [false],
    //   'isDelete': [false],
    //   'userId': [null],
    // });

  }


  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  ngOnInit() {
    this.base64Image = null;
    this.userData = JSON.parse(localStorage.getItem("userData"));

    this.route.params.subscribe((params: any) => {
      if (params.data) {
        this.petDetails = JSON.parse(params["data"]);
        this.url = params.route;
        console.log(this.url);
        console.log(this.petDetails);
        this.isEdit = true;
        this.isDisplay = true;
      }
      else
        this.isEdit = false;
    })
    if (this.petDetails) {
      this.petForm.patchValue(this.petDetails);
      this.base64Profie = this.petDetails.profileImage;
      this.category = this.petDetails.category;
      this.dob = this.petDetails.birthday;
      this.petForm.controls['birthday'].setValue(new Date(this.dob).toISOString().slice(0, -1))
    }
  }

  onPetBack() {
    if(this.url == 'petprofile'){
      this.navCtrl.navigateForward('/social/tabs/petprofile');
    }else{
      this.navCtrl.navigateForward('/social/tabs/pet-owner');
    }
  }


    primaryBreedChanged(event: { component: IonicSelectableComponent, value: any }) {
      this.isClickedItem1 = false;
      this.petForm.controls['primary_breed'].setValue(event.value.name)
    }
    secondaryBreedChanged(event: { component: IonicSelectableComponent, value: any }) {
      this.isClickedItem2 = false;
      this.petForm.controls['secondary_breed'].setValue(event.value.name)
    }
    async open() {
    this.breeds = []
    this.isClickedItem1 = true;
    await this.presentLoading();
    this.isOpened = this.primaryComponent.isOpened;
    if (this.isOpened) {
      this.breeds = this.dogBreeds.slice(0, 19)
      if (this.category == 'dog') {
        // this.breeds = [];
        this.breeds = this.dogBreeds.slice(0, 19)
      }
      if (this.category == 'cat') {
        // this.breeds = []
        this.breeds = this.catBreeds.slice(0, 19)
      }
      this.dismiss();
    }

  }
  async open1() {
    this.breeds = []
    this.isClickedItem2 = true;
    await this.presentLoading();
    this.isOpened = this.secondaryComponent.isOpened;
    if (this.isOpened) {
      this.breeds = this.dogBreeds.slice(0, 19)
      if (this.category == 'dog') {
        // this.breeds = [];
        this.breeds = this.dogBreeds.slice(0, 19)
      }
      if (this.category == 'cat') {
        // this.breeds = []
        this.breeds = this.catBreeds.slice(0, 19)
      }
      this.dismiss();
    }
  }

    getDogBreeds(page?: number, size?: number): [] {
    var breed: any = [];
    if (page && size) {
      breed = this.dogBreeds.slice((page - 1) * size, ((page - 1) * size) + size - 1);
    }
    return breed;
  }
  getCatBreeds(page?: number, size?: number): [] {
    var breed: any = [];
    if (page && size) {
      breed = this.catBreeds.slice((page - 1) * size, ((page - 1) * size) + size - 1);
    }
    return breed;
  }
  async getMoreBreeds(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (this.category == 'dog') {
      let breeds = [];
      breeds = await this.getDogBreeds(this.page, 20);
      breeds = event.component.items.concat(breeds);
      event.component.items = breeds;
      event.component.endInfiniteScroll();
    }
    if (this.category == 'cat') {
      let breeds: any = [];
      breeds = await this.getCatBreeds(this.page, 20);
      breeds = event.component.items.concat(breeds);
      // if (text) {
      //   ports = this.filterPorts(ports, text);
      // }
      event.component.items = breeds;
      event.component.endInfiniteScroll();
    }

    this.page++;
  }

  setPetCategory(category: string) {
    this.isDisplay = false;
    setTimeout(() => {
      this.isDisplay = true;
    }, 100);
    this.category = category;
    if (this.category == 'dog') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    if (this.category == 'cat') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    if (this.category == 'bird') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    if (this.category == 'others') {
      this.petForm.controls['primary_breed'].reset()
      this.petForm.controls['secondary_breed'].reset()
    }
    this.petForm.controls['category'].setValue(category);
  }

  SearchBreeds(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (!event.text || event.text.trim() === '') {
      return;
    }
    let breeds: any;
    if (this.category == 'dog') {
      breeds = this.dogBreeds.filter((v) => {
        if (v != null) { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
        else { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
      })
    }
    if (this.category == 'cat') {
      breeds = this.catBreeds.filter((v) => {
        if (v != null) { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
        else { return v.name.toLowerCase().indexOf(event.text.toLowerCase()) > -1 }
      })
    }
    event.component.items = breeds;
  }

  async presentLoading() {
    this.isLoading = true;
    const loadingElement = await this.loadingController.create({
      spinner: 'crescent',
      duration: 500,
      cssClass: 'custom-loading'
    });
    return await loadingElement.present();
  }
  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }

  hideKeyboard() {
    this.keyboard.hide();
  }

  updatePetProfile() {
    this.isLoading = true;
    console.log("petForm Data", this.petForm.value);
    this.apiService.updatePetProfile(this.petDetails._id, this.petForm.value).subscribe(res => {
      // this.dismiss();
      console.log(res);
      this.router.navigate(['/social/tabs/pet-owner'])
      this.isLoading = false;
      this.petForm.reset();
      this.base64Image = null;
      this.socket.emit('refresh', {});
      this.presentToast('Pet updated successfully');
    })
  }

  async selectProfile() {
    const actionSheet = await this.actionCtrl.create({
      header: 'Options',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takeProfilePhoto();
        }
      }, {
        text: 'Gallery',
        icon: 'albums',
        handler: () => {
          this.openGalleryForProfileImage();
        }
      }, {
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

  hideKeyBoard(event: any) {
    console.log(event)
    this.keyboard.hide()
  }

  profileFileName: string = null;
  takeProfilePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((filepath) => {
      this.crop.crop(filepath, { quality: 100 })
        .then((newFilePath) => {
          this.base64.encodeFile(newFilePath).then((base64File: string) => {
            console.log("base64File", base64File);
            this.base64Profie = base64File;
          }, (err) => {
            console.log(err);
          });
          var correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
          var currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
          this.copyProfileToLocalDir(correctPath, currentName, this.createFileName());

        }, (err) => {
          console.log(err)
        })
    }, (err) => {
      console.log(err)
    })
  }
  openGalleryForProfileImage() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      // destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imagePath) => {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          this.crop.crop(filePath, { quality: 100 })
            .then((newFilePath) => {
              this.base64.encodeFile(newFilePath).then((base64File: string) => {
                this.base64Profie = base64File;
              }, (err) => {
                console.log(err);
              });
              let correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
              let currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
              this.copyProfileToLocalDir(correctPath, currentName, this.createFileName());
            }, (err) => {
              console.log(err)
            });
        }, (err) => {
          console.log(err)
        })
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

  private copyProfileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.profileFileName = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

  onSubmit() {
    var petdescript = (<HTMLInputElement>document.getElementById('petdescript')).value;
    var petbox = (<HTMLInputElement>document.getElementById('petbox')).value;
    console.log(petdescript.length,petbox.length);
    this.petForm.controls['userId'].setValue(this.userData.id)
    this.petForm.controls['isAdopt'].setValue(false)
    this.petForm.controls['isDelete'].setValue(false)
    if(this.petForm.controls['gender'].value == null){
      this.petForm.controls['gender'].setValue("NA")
    }
    if(this.petForm.value.profileImage !== null){
      if(petbox.length <= 20 && petbox.length >= 4){
          if(petdescript.length >= 100 && petdescript.length < 250){
            if (this.petForm.valid) {
              this.isLoading = true;
              console.log(this.petForm.value)
              this.apiService.addPet(this.petForm.value).subscribe(res => {
                console.log(res);
                this.socket.emit('refresh', {});
                this.presentToast('Pet created successfully');
                // this.router.navigate(['/adoption-list', '2'])
                // this.router.navigateByUrl('/adoption-list/2', { skipLocationChange: true });
                this.navCtrl.navigateRoot(['/social/tabs/pet-owner'])
                this.isLoading = false;
                this.petForm.reset();
                this.base64Image = null;
                this.base64Profie = null;
              })
            }
              else {
              // this.dismiss();
              this.isLoading = false;
              this.petForm.markAsTouched();
              this.presentToast('Please enter all the fields');
              console.log("Please enter required fileds")
            }
         }
     else{
          this.presentToast('Description should be more than 100 and less than 250 characters');
        } 
    }
    else{
        this.presentToast('Pet name should be more than 3 and less than 30 characters');
    }   
      // this.presentLoading();
    }
    else{
        this.presentToast('Please upload profile image');
      }
    
  }

  public uploadProfileImage() {
    var url = this.apiService.base_url + "pet/pet_profile_image";
    // File for Upload
    if (this.profileFileName) {
      var targetPath = this.pathForImage(this.profileFileName);
      // File name only
      var filename = this.profileFileName;
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename }
      };
      const fileTransfer1: FileTransferObject = this.transfer.create();
      fileTransfer1.upload(targetPath, url, options).then(data => {
        console.log(data)
        this.petForm.controls['profileImage'].setValue(this.profileFileName)
        this.uploadImage();
      }, err => {
        // this.loading.dismissAll()
        // this.presentToast('Error while uploading file.');
      });
    } else {
      this.petForm.controls['profileImage'].setValue(null)
      this.uploadImage();
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

  public uploadImage(){
    if (!this.isEdit) {
        this.onSubmit();
      }
      else {
        console.log("update");
        this.updatePetProfile();
      }
  }

}
