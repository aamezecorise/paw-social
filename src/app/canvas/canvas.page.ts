import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.page.html',
  styleUrls: ['./canvas.page.scss'],
})
export class CanvasPage implements AfterViewInit {
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;
  saveX: number;
  saveY: number;
  drawing = false;

  selectedColor = '#9e2956';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '5db37e', '#459cde', '#4250ad', '#802fa3'];
  lineWidth = 5;
  file: any;
  base64ToGallery: any;

  constructor(private plt: Platform, private toastCtrl: ToastController) { }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = 200;
  }

  selectColor(color) {
    this.selectedColor = color;
  }

  startDrawing(ev) {
    // console.log('start: ', ev);
    this.drawing = true;
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    // console.log(canvasPosition);
    this.saveX = ev.pageX - canvasPosition.x;
    this.saveY = ev.pageY - canvasPosition.y;
  }

  endDrawing() {
    // console.log('end');
    this.drawing = false;
  }

  moved(ev) {
    // tslint:disable-next-line:curly
    if (!this.drawing) return;
    // console.log('move: ', ev);
    const canvasPosition = this.canvasElement.getBoundingClientRect();
    // tslint:disable-next-line:prefer-const
    let ctx = this.canvasElement.getContext('2d');

    const currentX = ev.pageX - canvasPosition.x;
    const currentY = ev.pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.selectedColor;
    ctx.lineWidth = this.lineWidth;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  // ngOnInit() {
  // }
  setBackground() {
    const background = new Image();
    background.src = './assets/images/1.jpg';
    const ctx = this.canvasElement.getContext('2d');

    background.onload = () => {
      ctx.drawImage(background, 0, 0, this.canvasElement.width, this.canvasElement.height);
    };
  }

  exportCanvasImage() {
    const dataUrl = this.canvasElement.toDataURL();
    console.log('image: ', dataUrl);

    const ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.plt.is('cordova')) {

      const options: Base64ToGalleryOptions = { prefix: 'canvas_', mediaScanner: true};

      this.base64ToGallery.base64ToGallery(dataUrl, options).then(
        async res => {
          const toast = await this.toastCtrl.create({
            message: 'Image saved to camera roll.',
            duration: 2000
          });
          toast.present();
        },
        err => console.log('Error saving image to gallery ', err)
      );

    } else {
      // tslint:disable-next-line:prefer-const
      let data = dataUrl.split(',')[1];
      const blob = this.b64toBlob(data, 'image/jpg');

      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'canvasimage.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    // tslint:disable-next-line:prefer-const
    let sliceSize = 512;
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

    // tslint:disable-next-line:prefer-const
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public saveBase64(base64: string, name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:prefer-const
      let realData = base64.split(',')[1];
      const blob = this.b64toBlob(realData, 'image/jpeg');

      this.file.writeFile(this.pictureDir, name, blob)
        .then(() => {
          resolve(this.pictureDir + name);
        })
        .catch((err) => {
          console.log('error writing blob');
          reject(err);
        });
    });
  }
  pictureDir(pictureDir: any, name: string, blob: Blob) {
    throw new Error('Method not implemented.');
  }
}
