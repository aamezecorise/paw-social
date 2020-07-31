import { Component, OnInit } from '@angular/core';
import { NavParams, AlertController,NavController, BooleanValueAccessor, PopoverController, ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  paramTitle: string;
  data:any;
  socket:any;
  petId: any;
  bkuserId: any;
  modal: any;
  parentRef: any;
  userData: any = {}

  constructor(
  	private navParams: NavParams,
    public router: Router,
    private apiService: ApiService,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public toastController: ToastController,
    private navCtrl: NavController, 
    public alertController: AlertController) {

	  this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');
     }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"))
    this.paramTitle = this.navParams.data.paramTitle;
    this.petId = this.navParams.data.petId;
    this.bkuserId = this.navParams.data.userId;
    this.parentRef = this.navParams.data.parentRef;
    this.data = this.navParams.data.data;
    console.log(this.parentRef,this.data);
    console.log(this.paramTitle);
  }

  removePet() {
    let data = {
      isDelete: true
    }
    // this.apiService.updatePet(this.petId, data).subscribe(res => {
    //   this.parentRef.onDismiss();
    // })
  }
  async presentToast(param: any) {
    const toast = await this.toastController.create({
      message: param,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentAlertConfirm(param) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: param,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            if(this.paramTitle === 'myevents'){
              var id = this.data._id
              this.apiService.deleteEvent(id).subscribe(async res => {
                console.log(res);
                this.socket.emit('refresh', {});
                this.popoverController.dismiss();
                await this.presentToast("Event has been deleted.")
              })
            }
            if(this.paramTitle === 'followhoomanprofile' || this.paramTitle === 'postdetails'){
              var id = this.data._id
              console.log(id);
              this.apiService.deletePost(id).subscribe(async res => {
                console.log(res);
                this.socket.emit('refresh', {});
                this.popoverController.dismiss();
                await this.presentToast("Post has been deleted.")
                if(this.paramTitle === 'postdetails'){
                  this.navCtrl.navigateBack('/social/tabs/followhoomanprofile');
                }
              })
            }
            
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  // async reportProfile() {
  //   let obj = {
  //     petId: this.petId,
  //     reportBy: this.userData.id
  //   }
  //   this.apiService.reportPage(obj).subscribe(async res => {
  //     this.popoverController.dismiss();
  //     await this.presentToast("The page has been reported.")
  //   })
  // }
  // shareLink() {
  //   this.popoverController.dismiss();
  //   this.parentRef.shareLink();
  // }
  // shareLink1() {
  //   this.popoverController.dismiss();
  //   this.parentRef.shareLink(this.petId);
  // }
  // reportPage() {
  //   this.popoverController.dismiss();
  //   this.parentRef.reportPage(this.petId)
  // }

  async deleteEvent(){
    this.popoverController.dismiss();
    this.presentAlertConfirm('Are you sure you want to delete this event?')
  }

  async deletePost(){
    this.popoverController.dismiss();
    this.presentAlertConfirm('Are you sure you want to delete this Post?')
  }

  editEvent(){
    console.log('edit event');
  }

  editPetProfile() {
    console.log('edited');
    this.parentRef.editPetProfile(this.parentRef.petdetails)
    this.popoverController.dismiss();
  }

  async report() {
    // this.keyboard.hide()
    console.log(this.data);
    this.modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'dialog-modal',
      componentProps: {
        "paramTitle": 'popover',
        "reportDetails": this.data
      }
    });
    this.popoverController.dismiss();
    return await this.modal.present();
  }



}
