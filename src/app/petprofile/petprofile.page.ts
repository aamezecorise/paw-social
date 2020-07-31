import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController,ModalController } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';
import { MainService } from '../main.service';
import { ApiService } from '../service/api.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { PostmodalPage } from '../postmodal/postmodal.page';

@Component({
  selector: 'app-petprofile',
  templateUrl: './petprofile.page.html',
  styleUrls: ['./petprofile.page.scss'],
})
export class PetprofilePage implements OnInit {

  petdetails:any;
  socket:any;
  userData:any = {};
  petDetail:any;
  allpets:any = [];
  followers:any = [];
  userArr:any = [];
  view:any;
  url:any;
  thoughtpost:any = [];
  imagevideo:any = [];
  famjam:any = [];
  allposts:any = [];
  modal: any;
  userdetails:any;

  constructor(
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions,
    private activateroute: ActivatedRoute, 
    public apiService: ApiService,
    private modalCtrl: ModalController, 
    public popoverController: PopoverController,
    public mainService: MainService,
    private router: Router) {

    this.thoughtpost = this.thoughtpost.map(item => ({
      ...item,
      showMore: false
    }));

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
    this.userData = JSON.parse(localStorage.getItem("userData"))
    console.log(this.userData);

    this.activateroute.queryParams.subscribe(params => {
        if (params && params.data) {
          this.petdetails = JSON.parse(params.data);
          console.log(this.petdetails);
        }
        if (params && params.route) {
          this.url = JSON.parse(params.route);
          console.log(this.url);
        }
      });
    }

  ngOnInit() {
    this.view = this.router.url;
    console.log(this.view);
    // this.getPetPost(this.petdetails._id);
    // this.getPetById(this.petdetails._id)
    // this.getAllPetsbyId(this.petdetails.userId);
    // this.getUserbyid(this.userData.id)

    this.socket.on('refreshPage', ()=>{
       
    })
  }

  trimString(string, length) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }

  ionViewWillEnter() {
    this.thoughtpost = [];
    this.imagevideo = [];
    this.famjam = [];
    this.allposts = [];
    this.getPetPost(this.petdetails._id);
    this.getPetById(this.petdetails._id);
    this.getAllPetsbyId(this.petdetails.userId);
    // this.socket.emit('refresh', {});
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

  onback() {
    if(this.url === '/social/tabs/pet-owner'){
      this.navCtrl.navigateBack('/social/tabs/pet-owner');
    }
    if(this.url === '/social/tabs/followhoomanprofile'){
      this.navCtrl.navigateBack('/social/tabs/followhoomanprofile');
    }
    // this.navCtrl.navigateBack('/social/tabs/pet-owner');
  }

  async presentPopover(ev: any, data: any) {
  console.log(ev,data);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      componentProps: {
        "user": this.mainService.username,
        "paramTitle": "petprofile",
        "petId": data._id,
        "data": data,
        "parentRef": this
      },
      translucent: true
    });
    return await popover.present();
  }

  getPetById(id){
    this.apiService.getpetbyid(id).subscribe(res => {
      this.petDetail = res['result'];
      this.followers = this.petDetail.followers.length;
      console.log(this.petDetail);
    })  
  }

  editPetProfile(data: any) {
    console.log("petdetails from popover", data);
    // this.closeModal();
    this.router.navigate(['/petprofile-create', { data: JSON.stringify(data), route:'petprofile' }]);
  }

   getAllPetsbyId(id){
    this.apiService.getpetsByUserId(id).subscribe(res => {
      this.allpets = res['result'];
      this.getUserbyid(this.userData.id)
      console.log(this.allpets);
    })
  }

  FollowPet(pet){
    console.log(pet,'follow');
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
      this.socket.emit('refresh', {});
    })  
  }

  UnFollowPet(pet){
    console.log(pet,'unfollow');
    var data = {
      UserId: this.userData.id,
      petId: pet._id,
      notificationType: 'petfollow'
    }
    console.log(data);
    this.apiService.UnFollowPet(data).subscribe(res => {
    console.log(res);
      this.socket.emit('refresh', {});
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

    getUserbyid(userid){
      this.apiService.getUserById(userid).subscribe(res => {
      console.log(res['result']);
      this.userdetails = res['result'];
      this.userArr = res['result']['following'];
       console.log(this.userArr);

       var petdata = res['result']['petAccess'];
        for(let i=0; i<petdata.length;i++){
          this.allpets = [...this.allpets,petdata[i].petId]
        }
        console.log(this.allpets);
      })
    }


  viewpetFollowers(){
    let navigationExtras: NavigationExtras = {
    queryParams: {
      data: JSON.stringify(this.petdetails),
      route: JSON.stringify(this.url)
      }
    };
    this.router.navigate(['/social/tabs/petfollowers'],navigationExtras);
  }

  getPetPost(petId){
    this.imagevideo = [];
    this.thoughtpost = [];
    this.famjam = [];
    this.apiService.getPetPost(petId).subscribe(res => {
      console.log(res['result']);
      var petpost = res['result'];
        for(let i=0; i<petpost.length; i++){
          if(petpost[i].postType == 'media' && petpost[i].isFamJam !== true){
            this.imagevideo = [...this.imagevideo,petpost[i]];
            console.log(this.imagevideo);
          }
          if(petpost[i].postType == 'thought'){
            this.thoughtpost = [...this.thoughtpost, petpost[i]];
            console.log(this.thoughtpost);
          }
          if(petpost[i].isFamJam == true){
            this.famjam = [...this.famjam, petpost[i]];
            console.log(this.famjam);
          }
        }
      })

  }

  async viewPets() {
    this.modal = await this.modalCtrl.create({
      component: PostmodalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramTitle": 'petprofile',
        "userDetails": this.userdetails
      }
    });
    return await this.modal.present();
  }

  postDetails(post){
    console.log(post);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(post),
        route: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['/social/tabs/postdetails'],navigationExtras);
  } 

  doRefresh(event) {
     this.getPetPost(this.petdetails._id);
     this.getPetById(this.petdetails._id);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  } 

  async petAccess(data: any) {
    // this.keyboard.hide()
    console.log(this.userdetails);
    console.log(this.petdetails);
    this.modal = await this.modalCtrl.create({
      component: PostmodalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramsubTitle": 'petAccess',
        "userDetails": this.userdetails,
        "petDetails": this.petdetails,
        "parentRef": this
      }
    });
    return await this.modal.present();
  }

}
