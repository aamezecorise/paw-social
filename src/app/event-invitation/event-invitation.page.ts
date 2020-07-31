import { Component, OnInit } from '@angular/core';
import { NavController,LoadingController,ToastController } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import { ApiService } from '../service/api.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';

@Component({
  selector: 'app-event-invitation',
  templateUrl: './event-invitation.page.html',
  styleUrls: ['./event-invitation.page.scss'],
})
export class EventInvitationPage implements OnInit {

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
  constructor(
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

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.eventdata = JSON.parse(params.data);
        console.log(this.eventdata);
      }
      if (params && params.image) {
        this.images = JSON.parse(params.image);
        console.log(this.images);
      }
      if (params && params.imgArray) {
        this.imgArray = JSON.parse(params.imgArray);
        console.log(this.imgArray);
      }
    });
  }

  ngOnInit() {
    if(this.eventdata.isPrivate == true){
      console.log('event private');
    }else if(this.eventdata.isPrivate == false){
      console.log('event public');
    }

    this.view = this.router.url;
    console.log(this.view);
    // this.isLoading = true;
    this.socket.emit('refresh', {});
    this.socket.on('refreshPage', ()=>{
       this.getAllUsers();
    })

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.slider) {
        this.eventUrl = JSON.parse(params.slider);
        console.log(this.eventUrl)
      }
    });
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    console.log(this.eventUrl);
    if(this.eventUrl == '/event-preview'){
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
  }

  onPreview() {
    this.isLoading = true;
    if(this.eventdata.isPrivate == true){
      if(this.invitations && this.invitations.length > 0){
        let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(this.eventdata),
          image: JSON.stringify(this.images),
          imgArray: JSON.stringify(this.imgArray)
        }
      };
      this.router.navigate(['event-preview'],navigationExtras);
      this.isLoading = false;
      }else{
        this.presentToast('Invite at least 1 User')
        this.isLoading = false;
      }
    }else if(this.eventdata.isPrivate == false){
      console.log('event public');
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: JSON.stringify(this.eventdata),
          image: JSON.stringify(this.images),
          imgArray: JSON.stringify(this.imgArray)
        }
      };
      this.router.navigate(['event-preview'],navigationExtras);
      this.isLoading = false;
    }

  }

  skip(){
    this.presentLoading();
    this.isLoading = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.eventdata),
        image: JSON.stringify(this.images),
        imgArray: JSON.stringify(this.imgArray)
      }
    };
    // this.navCtrl.navigateForward('/event-preview');
    this.router.navigate(['event-preview'],navigationExtras);
    this.isLoading = false;
  }



  onBackCreateEvent() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        slider: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['create-event'], navigationExtras);
    // this.navCtrl.navigateForward('/create-event');
  }


  getAllUsers(){
    this.apiService.getAllusers().subscribe(res => {
    console.log(res);
    if(res.error == false){
      this.isLoading = false;
    }
    this.allUsers = res.result;
    this.filterusers = res.result;
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

  invitation(user){
    var data = {'Userid':user._id,'UserName':user.fullName}
    this.invitations.push(data);
    this.eventdata.invitations = this.invitations;
    console.log(this.invitations);
  }

  removeItem(user){
    console.log(user);
    var id = user._id
    this.invitations.splice(this.invitations.findIndex(e => e.Userid === id),1);
    console.log(this.invitations);
  }

  CheckInArray(arr, id){
    const result = _.find(arr, ['Userid', id]);
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

  //   removeItem(position) {
  //   // if(!this.isEdit){
  //   this.filesArray.splice(position, 1)
  //   this.slidesArray.splice(position, 1)
  //   // } else {
  //   //   this.slidesArray.splice(position, 1)
  //     this.slidesArrayForEdit.splice(position, 1)
  //     this.apiService.removeMedia(this.petDetails._id, {profilePics: this.slidesArrayForEdit}).subscribe(res=>{
  //     })
  //   // }
  // }

}
