import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopoverComponent } from './popover/popover.component';
import { ModalPage } from './modal/modal.page';
// import { CreateEventPage } from './create-event/create-event.page';
// import { CameraPreviewPage } from './camera-preview/camera-preview.page';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { StartPage } from './start/start.page';
import { PostmodalPage } from './postmodal/postmodal.page';
import { AllusersmodalPage } from './allusersmodal/allusersmodal.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MaterialModule} from './material.module';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativePageTransitions, NativeTransitionOptions  } from '@ionic-native/native-page-transitions/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { PetprofilePipe } from './petprofile.pipe';
import 'hammerjs';
import { customAlertEnter } from '../directives/customAlertEnter';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AuthGuard, AuthGuard2, SessionGuard } from './service/auth-guard.service';
import { AuthenticationService } from './service/authentication.service';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { IonicSelectableModule } from 'ionic-selectable';

// import { FCM } from '@ionic-native/fcm/ngx';

const config: SocketIoConfig = { url: 'http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/', options: {} };

// const config: SocketIoConfig = { url: 'http://localhost:3000/', options: {} };

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'press': {time: 500},  // default: 251 ms
    'pinch': {enable: false},
    'rotate': {enable: false},
  };
}

@NgModule({
  declarations: [
  AppComponent, 
  PopoverComponent, 
  PetprofilePipe,
  StartPage,
  PostmodalPage,
  ModalPage,
  AllusersmodalPage
  ],
  entryComponents: [PopoverComponent,StartPage,PostmodalPage,ModalPage,AllusersmodalPage],
  
  imports: [
  BrowserModule,
  IonicModule.forRoot({alertEnter: customAlertEnter}),
  IonicModule.forRoot(), 
  AppRoutingModule,
  HttpClientModule,
  MatTabsModule, 
  AngularFontAwesomeModule, 
  BrowserAnimationsModule, 
  FormsModule,
  ReactiveFormsModule,
  Ionic4DatepickerModule,
  MaterialModule,
  TruncateModule,
  IonicSelectableModule,
  SocketIoModule.forRoot(config),
  IonicStorageModule.forRoot()
  ],

  providers: [
    StatusBar,
    Vibration,
    SplashScreen,
    NativePageTransitions,
    CameraPreview, 
    Base64ToGallery,
    Base64,
    Geolocation,
    NativeGeocoder,
    File,
    FilePath,
    FileTransfer, 
    FileTransferObject,
    InAppBrowser,
    Keyboard,
    Device,
    SocialSharing,
    AuthGuard, 
    AuthGuard2, 
    SessionGuard,
    Crop,
    MediaCapture,
    Media,
    Camera,
    WebView,
    AuthenticationService,
    GooglePlus,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig},
  ],
  exports: [MatTabsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule {}
