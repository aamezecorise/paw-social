import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { ModalController, Platform, NavController,ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router,NavigationExtras,ActivatedRoute} from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';

@Component({
  selector: 'app-camera-preview',
  templateUrl: './camera-preview.page.html',
  styleUrls: ['./camera-preview.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CameraPreviewPage implements OnInit {
  photos: any = [];
  picture: string;
  backButtonSubscription;
  images:any=[];
  myphoto:any;
  camerashow:boolean = true;
  icons:boolean = false;
  slidesArray: any = [];
  filesArray: any = [];
  tempFilePath: any;

  selectedFilter = '';
  selectedIndex = 0;
  result: HTMLElement;
  image: any = '';
  slideOpts = {
    slidesPerView: 3.5,
    spaceBetween: 5,
    slidesOffsetBefore: 20,
    freeMode: true
  };
  filterOptions = [
    { name: 'Normal', value: '' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Blue', value: 'blue_monotone' },
    { name: 'Violent', value: 'violent_tomato' },
    { name: 'Grey', value: 'greyscale' },
    { name: 'Brightness', value: 'brightness' },
    { name: 'Saturation', value: 'saturation' },
    { name: 'Contrast', value: 'contrast' },
    { name: 'Hue', value: 'hue' },
    { name: 'Cookie', value: 'cookie' },
    { name: 'Vintage', value: 'vintage' },
    { name: 'Koda', value: 'koda' },
    { name: 'Technicolor', value: 'technicolor' },
    { name: 'Polaroid', value: 'polaroid' },
    { name: 'Bgr', value: 'bgr' }
  ];

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height / 2,
    camera: 'rear',
    tapPhoto: true,
    tapToFocus: true,
    previewDrag: false,
    toBack: false,
    alpha: 1
  };

  pictureOpts: CameraPreviewPictureOptions = {
    width: window.screen.width,
    height: window.screen.height / 2,
    quality: 100
  };
  default = '/assets/pet2.jpg';
  MAX_FILE_SIZE = 10 * 1024 * 1024;

  constructor(
    private camera: Camera, 
    private transfer: FileTransfer, 
    private file: File,
    public filePath: FilePath,
    private imagePicker: ImagePicker, 
    private router: Router, 
    private navCtrl: NavController, 
    private cameraPreview: CameraPreview, 
    private modalCtrl: ModalController, 
    private videoEditor: VideoEditor,
    private webview: WebView,
    private crop: Crop,
    private nativePageTransitions: NativePageTransitions, 
    private platform: Platform,
    private base64ToGallery: Base64ToGallery,
    public toastController: ToastController,
    public base64: Base64) {

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/tabs/newsfeed');
    });
   }

  ngOnInit() {
   // this.startCamera();
   this.camerashow = true;
  }

  ionViewWillEnter() {}

  ionViewWillLeave() {
    this.stopcamera();
  }

  filter(index) {
    this.selectedFilter = this.filterOptions[index].value;
    this.selectedIndex = index;
  }
 
  imageLoaded(e) {
    let base64 = '';
    console.log(e);
    // Grab a reference to the canvas/image
    this.result = e.detail.result;
    console.log(this.result);
    let canvas = this.result as HTMLCanvasElement;
    console.log(canvas);
      // export as dataUrl or Blob!
    base64 = canvas.toDataURL('image/jpeg', 1.0);
    console.log(base64);
  }

  saveImage() {
    let base64 = '';
    if (!this.selectedFilter) {
      // Use the original image!
      base64 = this.image;
    } else {
      let canvas = this.result as HTMLCanvasElement;
      // export as dataUrl or Blob!
      base64 = canvas.toDataURL('image/jpeg', 1.0);
    }
 
    // Do whatever you want with the result, e.g. download on desktop
    this.downloadBase64File(base64);
  }

  downloadBase64File(base64) {
    const linkSource = `${base64}`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
 
    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = 'test.png';
    downloadLink.click();
  }

  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateBack('/social/tabs/newsfeed');
  }

  next(){
        if(this.filesArray && this.filesArray.length > 0){
          console.log(this.filesArray);
          var images = JSON.stringify(this.slidesArray);

        let navigationExtras: NavigationExtras = {
          queryParams: {
            postType: 'postmedia',
            image: JSON.stringify(this.slidesArray),
            imgArray: JSON.stringify(this.filesArray),
            route: 'camera-preview'
          }
        };
          this.router.navigate(['add-new-post'],navigationExtras);
    }else{
        this.presentToast('Please add atleast one image');
        console.log('Image not added');
    }
  }

  startCamera() {
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      });
  }

  stopcamera() {
    this.cameraPreview.stopCamera();
  }

  switchCamera() {
    this.cameraPreview.switchCamera();
  }

  setflash() {
    this.cameraPreview.setFlashMode(this.cameraPreview.FLASH_MODE.ON);
  }

  b64toBlob(b64Data, contentType='', sliceSize=512){
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  async takePicture() {
    this.camerashow = false;
    const result = await this.cameraPreview.takePicture(this.pictureOpts);
    console.log(result);

    // this.cameraPreview.takePicture(this.pictureOpts).then((filepath) => {
    //   console.log(filepath);
    //   this.tempFilePath = filepath
    //   this.base64.encodeFile(filepath).then((base64File: string) => {
    //     // this.base64Image = base64File;
    //     this.slidesArray.unshift({ file: base64File, type: 'image' })
    //     console.log(this.slidesArray);
    //   }, (err) => {
    //     console.log(err);
    //   });
    //   var currentName = filepath.substr(filepath.lastIndexOf('/') + 1);
    //   var correctPath = filepath.substr(0, filepath.lastIndexOf('/') + 1);
    //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    //   let obj = {
    //     fullPath: filepath,
    //     name: this.createFileName()
    //   }
    //   this.filesArray.unshift(obj)
    //   console.log(this.filesArray);
    // }, (err) => {
    //   console.log(err)
    // })

    // this.base64.encodeFile(result).then((base64File: string) => {
    //     // this.base64Image = base64File;
    //     this.slidesArray.unshift({ file: base64File, type: 'image' })
    //     console.log(this.slidesArray);
    //   }, (err) => {
    //     console.log(err);
    // });
    // var currentName = result.substr(result.lastIndexOf('/') + 1);
    //   var correctPath = result.substr(0, result.lastIndexOf('/') + 1);
    //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    //   let obj = {
    //     fullPath: result,
    //     name: this.createFileName()
    //   }
    //   this.filesArray.unshift(obj)
    //   console.log(this.filesArray);

    // this.picture = `data:image/jpeg;base64,${result}`;
    // this.images.push(this.picture);
    // console.log(this.picture);

    this.base64ToGallery.base64ToGallery(result, { prefix: '_img',mediaScanner: true }).then(
      res => console.log('Saved image to gallery ', res),
      err => console.log('Error saving image to gallery ', err)
    );

    const contentType = 'image/png';
    const b64Data = result;

    const blob = this.b64toBlob(b64Data, contentType);
    const blobUrl = URL.createObjectURL(blob);
    console.log(blobUrl);
    this.picture = blobUrl;
    console.log(this.picture);
    const img = document.createElement('img');
    console.log(img);
    img.src = blobUrl;
    console.log(img.src);
    document.body.appendChild(img);
    await this.cameraPreview.stopCamera();
  }


  opencamera(){
    this.images=[];
    this.camerashow = true;
    this.icons = false;
    this.startCamera();
  }


  // PickMultipleImages(){
  //   this.stopcamera();
  //   this.camerashow= false;
  //   this.icons= true;
  //   var options:ImagePickerOptions={
  //     maximumImagesCount:5,
  //     width:800,
  //     height:800,
  //   }
  //   this.imagePicker.getPictures(options).then((results)=>{
  //     console.log(results);
  //     for(var interval = 0;interval<results.length;interval++)
  //     {
  //       let filename = results[interval].substring(results[interval].lastIndexOf('/')+1);
  //       let path = results[interval].substring(0,results[interval].lastIndexOf('/')+1)
  //       console.log(filename);
  //       console.log(path);
  //       this.file.readAsDataURL(path,filename).then((base64string)=>{
  //         this.images.push(base64string);
  //         console.log(this.images);
  //         console.log(base64string);
  //       })
  //     }
  //   })
  // }

    lastImage: string = null;
    private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

    private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

    private createVideoFileName() {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".mp4";
      return newFileName;
    }


  removeItem(position) {
    // if(!this.isEdit){
      console.log(position);
      console.log(this.filesArray);
    this.filesArray.splice(position, 1)
    this.slidesArray.splice(position, 1)
    // } else {
    //   this.slidesArray.splice(position, 1)
      // this.slidesArrayForEdit.splice(position, 1)
      // this.apiService.removeMedia(this.petDetails._id, {profilePics: this.slidesArrayForEdit}).subscribe(res=>{
      // })
    // }
  }

  // openVideoGallery() {
  //   this.camera.getPicture({
  //     quality: 100,
  //     targetWidth: 1525,
  //     targetHeight: 720,
  //     mediaType: this.camera.MediaType.VIDEO,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   }).then(async(videoPath) => {

  //     if (videoPath) {
  //         var filename = videoPath.substr(videoPath.lastIndexOf('/') + 1);
  //         var dirpath = videoPath.substr(0, videoPath.lastIndexOf('/') + 1);

  //         dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
  //         try {
  //           var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
  //           var retrievedFile = await this.file.getFile(dirUrl, filename, {});

  //         } catch(err) {
  //           return this.presentToast("Something went wrong.");
  //         }
          
  //         retrievedFile.file( data => {
  //             if (data.size > this.MAX_FILE_SIZE) return this.presentToast( "You cannot upload more than 5mb.");
  //         });
  //       }
  //       var option: CreateThumbnailOptions = {
  //         fileUri: videoPath,
  //         outputFileName: videoPath.substr(videoPath.lastIndexOf('/') + 1).split('.')[0],
  //         atTime: 1,
  //         quality: 50,
  //       };
  //       this.videoEditor.createThumbnail(option).then(async res => {
  //         if (res != undefined) {
  //           let imagepath = 'file:///' + res;
  //           // this.tempFilePath = this.webview.convertFileSrc(imagepath);
  //           this.slidesArray.unshift({ file: videoPath, type: 'video', thumbnail: this.webview.convertFileSrc(imagepath) })
  //         }
  //       }).catch(err => {
  //         console.log("Framing Error", err);
  //       });

  //     let obj = {
  //       fullPath: videoPath,
  //       name: this.createFileName()
  //     }
  //     this.filesArray.unshift(obj)
  //     console.log(this.filesArray);
  //   }, (err) => {
  //     console.log(err)
  //   })
  // }

    openGallery() {
    this.camera.getPicture({
      quality: 100,
      targetWidth: 1525,
      targetHeight: 720,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.ALLMEDIA,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }).then(async (imagePath) => {
      console.log(imagePath);
      var videoExtension = imagePath.search(".mp4");
      console.log(videoExtension);

      if(videoExtension !== -1){
        if (imagePath) {
          var filename = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var dirpath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

          dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;
          try {
            var dirUrl = await this.file.resolveDirectoryUrl(dirpath);
            var retrievedFile = await this.file.getFile(dirUrl, filename, {});

          } catch(err) {
            return this.presentToast("Something went wrong.");
          }
          
          retrievedFile.file( data => {
              if (data.size > this.MAX_FILE_SIZE) return this.presentToast( "You cannot upload more than 5mb.");
              var option: CreateThumbnailOptions = {
                fileUri: imagePath,
                outputFileName: imagePath.substr(imagePath.lastIndexOf('/') + 1).split('.')[0],
                atTime: 1,
                quality: 50,
              };
              this.videoEditor.createThumbnail(option).then(async res => {
                if (res != undefined) {
                  let imagepath = 'file:///' + res;
                  // this.tempFilePath = this.webview.convertFileSrc(imagepath);
                  this.slidesArray.unshift({ file: imagePath, type: 'video', thumbnail: this.webview.convertFileSrc(imagepath) })
                }
              }).catch(err => {
                console.log("Framing Error", err);
              });

            let obj = {
              fullPath: imagePath,
              name: this.createVideoFileName()
            }
            this.filesArray.unshift(obj)
            console.log(this.filesArray);
          });
        }
        
      }  

      else{
        this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          this.crop.crop(filePath, { quality: 100 })
            .then((newFilePath) => {
              console.log(newFilePath);
                this.base64.encodeFile(newFilePath).then((base64File: string) => {
                this.slidesArray.unshift({ file: base64File, type: 'image' })
                console.log(this.slidesArray);
              }, (err) => {
                console.log(err);
              });
              let correctPath = newFilePath.substr(0, newFilePath.lastIndexOf('/') + 1);
              let currentName = newFilePath.substring(newFilePath.lastIndexOf('/') + 1, newFilePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

              let obj = {
                fullPath: newFilePath,
                name: this.createFileName()
              }
              this.filesArray.unshift(obj)
            });
        });
      
      console.log(this.filesArray);
      }

    }, (err) => {
      console.log(err)
    })
  }

}



