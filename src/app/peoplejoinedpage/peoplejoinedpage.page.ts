import { Component, OnInit } from '@angular/core';
import { NavController,ToastController } from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute, Router,NavigationExtras} from '@angular/router';
import { ApiService } from '../service/api.service';
import _ from 'lodash';
import { MainService } from '../main.service';

@Component({
  selector: 'app-peoplejoinedpage',
  templateUrl: './peoplejoinedpage.page.html',
  styleUrls: ['./peoplejoinedpage.page.scss'],
})
export class PeoplejoinedpagePage implements OnInit {

  allUsers:any;
  filterusers:any;
  isLoading = true;
  eventId:any;
  constructor(
    private activateroute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions, 
    public apiService: ApiService,
    public mainService: MainService,
    public toastController: ToastController) { 

    this.activateroute.queryParams.subscribe(params => {
        this.eventId = JSON.parse(params.eventId);
        console.log(this.eventId);
    });
  }



  doRefresh(event) {
    this.getAllJoinedEvents(this.eventId);
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'left',
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

  onBack() {
    this.navCtrl.navigateForward('/event-cards');
  }

  getAllJoinedEvents(eventId){
    this.apiService.getAllJoinedEvents(eventId).subscribe(res => {
    console.log(res);
    if(res.error == false){
      this.isLoading = false;
    }
    this.allUsers = res.result.reverse();
    this.filterusers = res.result;
    console.log(this.allUsers);
    })
  }

  ngOnInit() {
    // this.isLoading = true;
    this.getAllJoinedEvents(this.eventId);
  }

  searchfilter(event){
    const val = event.target.value.toLowerCase();
    const filter = this.filterusers.filter(function(d) {
    return d.fullName.toLowerCase().indexOf(val) !== -1;
    });
    this.allUsers = filter;
    this.allUsers.offset = 0;
  }

  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }


}
