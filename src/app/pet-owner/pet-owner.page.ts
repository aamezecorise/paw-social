import { Component, OnInit } from '@angular/core';
import { NavController, ToastController} from '@ionic/angular';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import io from 'socket.io-client';

@Component({
  selector: 'app-pet-owner',
  templateUrl: './pet-owner.page.html',
  styleUrls: ['./pet-owner.page.scss'],
})
export class PetOwnerPage implements OnInit {

  sliderOpts = {
    speed: 500,
    duration: 15000,
    slidesPerView: 3,
    spaceBetween: 0,
  };

  userData: any = {};
  allpets:any = [];
  socket:any;
  Loading = true;
  view:any;
  darkMode:boolean = false;
  userDetails:any;

  constructor(
    private navCtroller: NavController,
    private toastCtrl: ToastController,
    public apiService: ApiService,
    private iab: InAppBrowser,
    private activateroute: ActivatedRoute, 
    private router: Router,
    private socialSharing: SocialSharing,
  ) {

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.userData = JSON.parse(localStorage.getItem("userData"))
    console.log(this.userData);

    window.onclick = function(event) {
      var fabs = document.querySelectorAll('ion-fab');
      for (var i = 0; i < fabs.length; i++) {
        fabs[i].activated = false;
      }
    }
   }
  onNavagateAdd() {
    this.navCtroller.navigateForward('petprofile-create');
  }
  onNavagateEvent() {
    this.navCtroller.navigateForward('/event-cards');
  }
  ngOnInit() {
    // this.socket.on('refreshPage', ()=>{
    //   this.getAllPetsbyId(this.userData.id);
    // })
    this.getAllPetsbyId(this.userData.id);
  }

  ionViewWillEnter() {
    this.allpets = [];
    this.view = this.router.url;
    console.log(this.view);
    this.getAllPetsbyId(this.userData.id);
    // this.getAllPetsbyId(this.userData.id);
    // this.socket.emit('refresh', {});
  }

  applocation(){
    window.open('https://play.google.com/store/apps/details?id=com.pawzeeble');
  }

  mating(){
    this.presentToast();
  }

  redirectPrivacyPolicy() {
    this.iab.create('https://www.pawzeeble.com/privacy.html')
  }
  redirectTerms() {
    this.iab.create('https://www.pawzeeble.com/terms.html')
  }
  redirectEULA() {
    this.iab.create('https://www.pawzeeble.com/licenseagreement.html')
  }
  redirectFAQ() {
    this.iab.create('https://www.pawzeeble.com/faq.html')
  }

  shareLink(value: any) {
    console.log(value);
    var url = "http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/event/";
    this.socialSharing.share(url).then((res) => {
      console.log(res);
      //Success
    }).catch((e) => {
      //error
    })
  }

  getAllPetsbyId(id){
    this.allpets = [];
    this.apiService.getpetsByUserId(id).subscribe(res => {
      this.allpets = res['result'];
      this.getUserbyid(this.userData.id);
      this.Loading = false;
      console.log(res);
      console.log(this.allpets);
    })
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Comming Soon',
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

  doRefresh(event) {
    // document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
    //  searchInput.value = '';
    // });
    this.getAllPetsbyId(this.userData.id);
    this.getUserbyid(this.userData.id);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  petProfile(pet) {
    console.log(pet);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(pet),
        route: JSON.stringify(this.view)
      }
    };
    this.router.navigate(['/social/tabs/petprofile'],navigationExtras);
  }

  camboi(){
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark');

    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // if(prefersDark.matches){
    //   document.body.classList.toggle('dark');
    // }
  }

  saved(){
    this.navCtroller.navigateForward('/social/tabs/saved');
  }

  getUserbyid(userid){
    this.apiService.getUserById(userid).subscribe(res => {
      console.log(res);
      var petdata = res['result']['petAccess'];
      for(let i=0; i<petdata.length;i++){
        this.allpets = [...this.allpets,petdata[i].petId]
      }
      this.userDetails = res.result;
      console.log(this.userDetails);
      console.log(this.allpets);
    })
  }


}
