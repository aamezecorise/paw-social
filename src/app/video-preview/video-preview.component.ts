import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ModalController, Platform, NavController, ActionSheetController,ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Storage } from '@ionic/storage';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Router,NavigationExtras,ActivatedRoute} from '@angular/router';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ApiService } from '../service/api.service';


const MEDIA_FOLDER_NAME = 'my_media';



@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.scss'],
})
export class VideoPreviewComponent implements OnInit {


  slidesArray: any = [];
  filesArray: any = [];
  capturedVideo: any;
  tempFilePath: any;
  MAX_FILE_SIZE = 10 * 1024 * 1024;
 
  backButtonSubscription;

  constructor(private router: Router,
    private mediaCapture: MediaCapture,
    private file: File,
    private transfer: FileTransfer, 
    private media: Media,
    public apiService: ApiService,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private navCtrl: NavController,
    private modalCtrl:ModalController,
    public filePath:FilePath,
    public camera: Camera,
    private webview: WebView,
    private videoEditor: VideoEditor,
    public base64: Base64,
    public fileChooser:FileChooser,
    public toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private plt: Platform) {

    this.backButtonSubscription = this.plt.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/tabs/newsfeed');
    });
   }

   ngOnInit() {
  }

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 5,
      duration: 30,
      quality: 1
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      this.capturedVideo = capturedFile.fullPath;
      var option: CreateThumbnailOptions = {
        fileUri: capturedFile.fullPath,
        outputFileName: capturedFile.fullPath.substr(capturedFile.fullPath.lastIndexOf('/') + 1).split('.')[0],
        atTime: 1,
        quality: 50,
      };
      this.videoEditor.createThumbnail(option).then(async res => {
        if (res != undefined) {
          let imagepath = 'file:///' + res;
          // this.tempFilePath = this.webview.convertFileSrc(imagepath);
          this.slidesArray.unshift({ file: capturedFile, type: 'video', thumbnail: this.webview.convertFileSrc(imagepath) })
        }
      }).catch(err => {
        console.log("Framing Error", err);
      });
      let obj = {
        image: capturedFile
      }
      this.filesArray.unshift(capturedFile);
      console.log(this.filesArray.unshift(capturedFile));
    },
      (err: CaptureError) => console.error(err));
  }


  next(){
        if(this.filesArray && this.filesArray.length > 0){
          console.log(this.filesArray);

        let navigationExtras: NavigationExtras = {
          queryParams: {
            postType: 'videopost',
            video: JSON.stringify(this.slidesArray),
            imgArray: JSON.stringify(this.filesArray),
            route: 'video-preview'
          }
        };
          this.router.navigate(['add-new-post'],navigationExtras);
    }else{
        this.presentToast('Please add atleast one video');
        console.log('Video not added');
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

    openGallery() {
    this.camera.getPicture({
      quality: 100,
      targetWidth: 1525,
      targetHeight: 720,
      mediaType: this.camera.MediaType.VIDEO,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then(async(videoPath) => {

      if (videoPath) {
          var filename = videoPath.substr(videoPath.lastIndexOf('/') + 1);
          var dirpath = videoPath.substr(0, videoPath.lastIndexOf('/') + 1);

          dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
          try {
            var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            var retrievedFile = await this.file.getFile(dirUrl, filename, {});

          } catch(err) {
            return this.presentToast("Something went wrong.");
          }
          
          retrievedFile.file( data => {
              if (data.size > this.MAX_FILE_SIZE) return this.presentToast( "You cannot upload more than 5mb.");
          });
        }
        var option: CreateThumbnailOptions = {
          fileUri: videoPath,
          outputFileName: videoPath.substr(videoPath.lastIndexOf('/') + 1).split('.')[0],
          atTime: 1,
          quality: 50,
        };
        this.videoEditor.createThumbnail(option).then(async res => {
          if (res != undefined) {
            let imagepath = 'file:///' + res;
            // this.tempFilePath = this.webview.convertFileSrc(imagepath);
            this.slidesArray.unshift({ file: videoPath, type: 'video', thumbnail: this.webview.convertFileSrc(imagepath) })
          }
        }).catch(err => {
          console.log("Framing Error", err);
        });

      let obj = {
        fullPath: videoPath,
        name: this.createFileName()
      }
      this.filesArray.unshift(obj)
      console.log(this.filesArray);
    }, (err) => {
      console.log(err)
    })
  }

    lastImage: string = null;
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

    private createFileName() {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".mp4";
      return newFileName;
    }

    removeItem(position) {
      // if(!this.isEdit){
      this.filesArray.splice(position, 1)
      this.slidesArray.splice(position, 1)
    }

  dismiss() {
    this.navCtrl.navigateBack('/social/tabs/newsfeed');
  }
  
}
