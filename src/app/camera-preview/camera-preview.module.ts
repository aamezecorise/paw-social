import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CameraPreviewPage } from './camera-preview.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';

const routes: Routes = [
  {
    path: '',
    component: CameraPreviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers:[Camera,ImagePicker,VideoEditor],
  declarations: [CameraPreviewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CameraPreviewPageModule {}
