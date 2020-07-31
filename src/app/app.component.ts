import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, NavController, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MainService } from './main.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication.service';
import { Storage } from '@ionic/storage';
import { ApiService } from './service/api.service';
import { async } from '@angular/core/testing';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  rootPage: any = 'animation';
  userData: any = {};
  profile:any;
  defaultProfileImage: any;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  backButtonSubscription;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public mainService: MainService,
    public router: Router,
    public storage: Storage,
    public apiService: ApiService,
    private iab: InAppBrowser,
    public toastController: ToastController,
    public alertController: AlertController,
    private nativePageTransitions: NativePageTransitions,
    private authenticationService: AuthenticationService,
  ) {

      this.platform.ready().then(() => {
      this.menuCtrl.swipeEnable(false)
      this.statusBar.backgroundColorByHexString('#4c2a76');
      this.statusBar.overlaysWebView(false);
      if (localStorage.getItem("userData")) {
        this.apiService.isLoggedIn = true;
      }
      this.initializeApp();

      this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
        let view = this.router.url;
        if (view == "/social/tabs/newsfeed") {
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            localStorage.removeItem('device_id')
            //localStorage.removeItem('platForm')
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else if (view == "/login") {
          //Double check to exit app                  
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            sessionStorage.clear();
            localStorage.removeItem('device_id')
            localStorage.removeItem('platForm')
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } else if (view == "/home") {
          //Double check to exit app                  
          if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp(); //Exit from app
            sessionStorage.clear();
          } else {
            await this.presentToast();
            this.lastTimeBackPress = new Date().getTime();
          }
        } 
        else {
          // go to previous page
          // this.navCtrl.pop();
          this.router.navigate(['/social/tabs/newsfeed'])
        }
      });
    });

    // this.userData = JSON.parse(localStorage.getItem("userData"));
    // this.profile = this.userData.profileImage;
    // console.log(this.userData);
    // console.log(this.profile);

  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   });
  // }

    initializeApp() {
    localStorage.setItem("platForm", "android")
    this.defaultProfileImage = "assets/img/profile_icon.png";
    this.platform.ready().then(() => {

          this.statusBar.backgroundColorByHexString('#4c2a76');
          this.statusBar.overlaysWebView(false);
          this.splashScreen.hide();

          this.authenticationService.authState.subscribe(state => {
            if (state) {
              let options: NativeTransitionOptions = {
                direction: 'left',
                duration: 300
              }
              this.nativePageTransitions.slide(options).then().catch();
              this.router.navigate(['/social/tabs/newsfeed']);
            } else {
              this.router.navigate(['/home']);
            }
          })
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Press back again to exit App",
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}
