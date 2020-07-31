import { Component, ViewChild, OnInit} from '@angular/core';
import { NavController, IonContent,Events,ModalController} from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { InViewportMetadata } from 'ng-in-viewport';
import { ApiService } from '../service/api.service';
import { AllusersmodalPage } from '../allusersmodal/allusersmodal.page';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  modal: any;
  newsfeedData:any = [];
  trend1:any = [];
  trend2:any = [];
  trend3:any = [];
  view:any;
  
  @ViewChild(IonContent, { static: false }) private content: IonContent;

  constructor(
    private router: Router, 
    public events: Events,
    public navCtrl: NavController, 
    private modalCtrl: ModalController, 
    private nativePageTransitions: NativePageTransitions,
    public apiService: ApiService) {

    window.onclick = function(event) {
      var fabs = document.querySelectorAll('ion-fab');
      for (var i = 0; i < fabs.length; i++) {
        fabs[i].activated = false;
      }
    }
  }

 
  ngOnInit() {
    this.getTrendingPosts();
  }

 ionViewWillEnter() {
   this.view = '/social/tabs/tab2';
    console.log(this.view);
    // this.getTrendingPosts();
    this.events.subscribe('tabs', tabNumber => {
        if (tabNumber === 'tab2') { 
            this.content.scrollToTop(1000); 
        } 
    });
  }

  ionViewDidLeave() {
    this.events.unsubscribe('tabs', () => {} );
  }
  
  explore() {
    this.router.navigate(['explore']);
  }


  doRefresh(event) {
    this.getTrendingPosts();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    
  }


  async showUsers() {
    // this.keyboard.hide()
    this.modal = await this.modalCtrl.create({
      component: AllusersmodalPage,
      componentProps: {
        "parentRef": this
      }
    });
    return await this.modal.present();
  }

  getTrendingPosts(){
    this.apiService.getTrendingPosts().subscribe(res => {
      console.log(res);
      if(res['result'][0]){
        this.trend1 = res['result'][0];
        console.log(this.trend1);
      }else {
        console.log('undefined');
      }
      if(res['result'][1]){
        this.trend2 = res['result'][1];
      }else {
        console.log('undefined');
      }
      if(res['result'][2]){
        this.trend3 = res['result'][2];
      }else {
        console.log('undefined');
      }

      var data = res['result'];
      data = data.filter((data,idx) => idx > 2)
      console.log(data);
      this.newsfeedData = data;
      console.log(this.newsfeedData);
    })
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

}
