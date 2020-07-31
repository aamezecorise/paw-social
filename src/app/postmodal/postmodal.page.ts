import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController, NavParams,ToastController,NavController,LoadingController,AlertController} from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
declare var google: any;

@Component({
  selector: 'app-postmodal',
  templateUrl: './postmodal.page.html',
  styleUrls: ['./postmodal.page.scss'],
})
export class PostmodalPage implements OnInit {

  userData: any = {};
  allpets:any = [];
  paramTitle: any;
  paramsubTitle:any;
  userDetails:any;
  socket:any;
  userArr:any = [];
  petAccessArr:any = [];
  view:any;
  allUsers:any;
  petusers:any;
  filterusers:any;
  isLoading = true;
  tagged:any = [];
  parentRef: any;
  postData:any;
  postAccount:any = [];
  filesArray:any;
  Loading = false;
  petDetails:any;
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
    public alertController: AlertController, 
    public modalCtrl: ModalController) {

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);
    }


  ngOnInit() {
    this.parentRef = this.navParams.data.parentRef;
    console.log(this.parentRef);
    this.paramTitle = this.navParams.data.paramTitle;
    this.paramsubTitle = this.navParams.data.paramsubTitle;
    this.userDetails = this.navParams.data.userDetails;
    this.postData = this.navParams.data.postData;
    this.filesArray = this.navParams.data.filesArray;
    this.petDetails = this.navParams.data.petDetails;

    console.log(this.paramTitle);
    console.log(this.userDetails);
    console.log(this.postData);
    console.log(this.petDetails);
    this.getAllPetsbyId(this.userDetails._id);
    // this.getUserbyid(this.userData.id)
    this.getAllUsers();
    this.socket.on('refreshPage', ()=>{
       this.getAllUsers();
    })
    this.view = '/social/tabs/followhoomanprofile';
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

	getAllPetsbyId(id){
    this.allpets = [];
    this.apiService.getpetsByUserId(id).subscribe(res => {
      this.allpets = res['result'];
      this.getUserbyid(this.userData.id)
      console.log(this.allpets);
    })
  }

   getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
    this.userArr = res['result']['following'];
    this.petAccessArr = res['result']['accessgivenTo'];

    var petdata = res['result']['petAccess'];
      for(let i=0; i<petdata.length;i++){
        this.allpets = [...this.allpets,petdata[i].petId]
    }
     console.log(this.allpets);
     console.log(this.userArr);
     console.log(this.petAccessArr);
    })
  }

    getAllUsers(){
      this.apiService.getAllusers().subscribe(res => {
      if(res.error == false){
        this.isLoading = false;
      }
      this.allUsers = res.result;
      console.log(this.allUsers);
      this.filterusers = res.result;
      })
    }

  FollowPet(pet){
    console.log(pet);
    var data = {
      UserId: this.userData.id,
      petId: pet._id,
      petParentId: pet.userId,
      userName: this.userData.userName,
      petName: pet.petName,
      petProfile: pet.profileImage,
      notificationType: 'petfollow'
    }

    console.log(data);
    this.apiService.FollowPet(data).subscribe(res => {
    console.log(res);
    this.getUserbyid(this.userData.id);
      // this.socket.emit('refresh', {});
    })  
  }

  UnFollowPet(pet){
    console.log(pet);
    var data = {
      UserId: this.userData.id,
      petId: pet._id,
      petParentId: pet.userId,
      notificationType: 'petfollow'
    }
    console.log(data);
    this.apiService.UnFollowPet(data).subscribe(res => {
    console.log(res);
    this.getUserbyid(this.userData.id);
      // this.socket.emit('refresh', {});
    })  
  }

  CheckInArray(arr, id){
      const result = _.find(arr, ['petFollowed._id',id]);
      if(result){
        return true;
      }else {
        return false;
      }
    }


  petProfile(pet) {
    console.log(pet);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(pet),
        route: JSON.stringify(this.view)
      }
    };
    this.closeModal();
    this.router.navigate(['/social/tabs/petprofile'],navigationExtras);
  }

  onClear(e){
    console.log(e);
    this.socket.emit('refresh', {});
  }

  searchfilter(event){
    const val = event.target.value.toLowerCase();
    const filter = this.filterusers.filter(function(d) {
      return d.fullName.toLowerCase().indexOf(val) !== -1;
    });
    this.allUsers = filter;
    this.petusers = filter;
    this.petusers.offset = 0;
    this.allUsers.offset = 0;
  }

  tagUser(user){
    var data = {'Userid':user._id,'UserName':user.userName}
    this.tagged.push(data);
    console.log(this.tagged);
  }

  untagUser(user){
    console.log(user);
    var id = user._id
    this.tagged.splice(this.tagged.findIndex(e => e.Userid === id),1);
    console.log(this.tagged);
  }

  CheckInArray1(arr, id){
    const result = _.find(arr, ['Userid', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  CheckInArrayPetAccess(arr, id){
    if(id == this.petDetails._id){
      const result = _.find(arr, ['petId', id]);
        if(result){
          return true;
        }else {
          return false;
        }
    }
  }

  taggedPeople(){
    console.log(this.tagged);
    this.modalCtrl.dismiss({
        'tagged': this.tagged,
        'modalroute': 'tagmodal'
    });
    this.parentRef.onDismiss();
  }

  selectPostAccount(pet){
    var data = {'Petid':pet._id,'PetName':pet.petName}
    this.postAccount.push(data);
    console.log(this.postAccount);
  }

  unselectPostAccount(pet){
    console.log(pet);
    var id = pet._id
    this.postAccount.splice(this.postAccount.findIndex(e => e.Petid === id),1);
    console.log(this.postAccount);
  }

  CheckInArray2(arr, id){
    const result = _.find(arr, ['Petid', id]);
    if(result){
      return true;
    }else {
      return false;
    }
  }

  TextPost(){
    this.postData.postAccount = this.postAccount;
    console.log(this.postData);
    console.log(this.postAccount);
    this.apiService.add_new_post(this.postData).subscribe(res => {
        console.log(res);
        this.socket.emit('refresh', {});
        this.closeModal();
        this.presentToast('Thought Posted Successfully');
        this.navCtrl.navigateForward('/social/tabs/newsfeed');
      })
  }

  ImagePost(){
    if(this.postAccount.length > 1){
      this.postData.isFamJam = true;
    }
    this.postData.postAccount = this.postAccount;
    console.log(this.postData);
    console.log(this.postAccount);
    this.apiService.add_new_post(this.postData).subscribe(res => {
        console.log(res);
        this.socket.emit('refresh', {});
        this.closeModal();
        if(this.paramTitle === 'videopost'){
          this.presentToast('Video Posted Successfully');
        }
        if(this.paramTitle === 'imagepost'){
          this.presentToast('Image Posted Successfully');
        }
        this.navCtrl.navigateForward('/social/tabs/newsfeed');
      })
  }


  public uploadImage() {

    (<HTMLInputElement>document.getElementById('imgpost')).disabled = true;
    // Destination URL
    this.presentLoading();
    var url = this.apiService.base_url + "post/media_post";
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
              this.ImagePost();
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

  public uploadVideo() {

    (<HTMLInputElement>document.getElementById('vidpost')).disabled = true;
    // Destination URL
    this.presentLoading();
    var url = this.apiService.base_url + "post/video_post";
    console.log(url);
    // File for Upload

    if (this.filesArray.length > 0) {
      for (let i = 0; i < this.filesArray.length; i++) {
        var targetPath = this.filesArray[i].fullPath;
        var fileName = this.filesArray[i].name;
        var options = {
          fileKey: "video",
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
              this.ImagePost();
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


  //   givePetAccess(param:any): Observable<any> {
  //   return this.http.post(environment.givePetAccessUrl,param)
  // }
  // takePetAccess(param:any): Observable<any> {
  //   return this.http.post(environment.takePetAccessUrl,param)
  // }


  giveAccess(data){
    console.log(data);
    var petdata = {
      userId: data._id,
      petId: this.petDetails._id,
      petownerId: this.petDetails.userId,
      userName: this.userData.userName,
      notificationType: 'petAccess',
      petName: this.petDetails.petName,
      petProfile: this.petDetails.profileImage
    }
    var username = data.userName;
    console.log(petdata);
    this.presentAlertConfirm('Are you sure you want to give pet access to ' + username , petdata)
  }

  async presentAlertConfirm(param,petdata) {
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
          text: 'Okay',
          handler: () => {
              this.apiService.givePetAccess(petdata).subscribe(res => {
              console.log(res);
              this.presentToast('Pet access given Successfully');
              // this.socket.emit('refresh', {});
              this.getUserbyid(this.userData.id)
               this.getAllUsers();
            })
          }
        }
      ]
    });
    await alert.present();
  }

  takeAccess(data){
    console.log(data);
    var petdata = {
      userId: data._id,
      petId: this.petDetails._id,
      petownerId: this.petDetails.userId,
      userName: this.userData.userName,
      notificationType: 'petAccess',
      petName: this.petDetails.petName,
      petProfile: this.petDetails.profileImage
    }
    var username = data.userName;
    console.log(petdata);
    this.presentAlertConfirm1('Are you sure you want to take back the pet access from ' + username , petdata)
  }

  async presentAlertConfirm1(param,petdata) {
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
          text: 'Okay',
          handler: () => {
              this.apiService.takePetAccess(petdata).subscribe(res => {
              console.log(res);
              // this.socket.emit('refresh', {});
              this.getUserbyid(this.userData.id)
               this.getAllUsers();
              this.presentToast('Pet access taken away Successfully');
            })
          }
        }
      ]
    });
    await alert.present();
  }

  


}
