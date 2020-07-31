import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController, Platform,ToastController} from '@ionic/angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import io from 'socket.io-client';
import _ from 'lodash';
import { MainService } from '../main.service';
import * as moment from 'moment';

@Component({
  selector: 'app-eventcomments',
  templateUrl: './eventcomments.page.html',
  styleUrls: ['./eventcomments.page.scss'],
})
export class EventcommentsPage implements OnInit {
@ViewChild('input',{ static: false }) myInput ;
view:any;
socket:any;
userData: any = {};
backButtonSubscription:any;
commentdata:any;
comments:any;
comment:any;
url:any;
likeUnlikeImage:any = 'assets/icon/heart-outline.svg';
replydata: any;

  constructor(
  	private activateroute: ActivatedRoute, 
    private router: Router, 
    public apiService: ApiService,
    private navCtrl: NavController, 
    private nativePageTransitions: NativePageTransitions, 
    private platform: Platform,
    public mainService: MainService,
    private toastCtrl: ToastController, 
    private socialSharing: SocialSharing) { 

    this.activateroute.queryParams.subscribe(params => {
      if (params && params.data) {
        this.commentdata = JSON.parse(params.data);
        console.log(this.commentdata);
      }
      if (params && params.route) {
        this.url = params.route;
        console.log(this.url);
      }

      
    });

    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData);

    this.socket = io('http://ec2-3-7-46-127.ap-south-1.compute.amazonaws.com:6560/');
    // this.socket = io('http://localhost:3000/');

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.navCtrl.navigateBack('/event-cards');
    });
  }

  ngOnInit() {
    this.view = this.router.url;
    this.getpostbyPostid(this.commentdata._id);
    console.log(this.view);
    this.socket.on('refreshPage', data =>{
      // this.getpostbyPostid(this.commentdata._id);
    })
  }

  doRefresh(event) {
    this.getpostbyPostid(this.commentdata._id);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getpostbyPostid(id){
    this.apiService.getpostbyPostid(id).subscribe(res => {
    this.comments = res.result.comments.reverse();
    console.log(res);
    })
  }

  ionViewWillEnter() {
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 250
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
      direction: 'left',
      duration: 250
    }
    this.nativePageTransitions.slide(options)
      .then(onSuccess => {
        //
      })
      .catch(onError => {
        //
      });
  }

  async presentToast(param) {
    const toast = await this.toastCtrl.create({
      message: param,
      position: 'bottom',
      duration: 2000
    });

    return await toast.present();
  }

    onBack() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(this.view)
      }
    };
    if(this.url == 'newsfeed'){
      this.router.navigate(['social/tabs/newsfeed'], navigationExtras);
    }
    if(this.url == 'event-cards'){
      this.router.navigate(['event-cards'], navigationExtras);
    }
    // this.navCtrl.navigateBack('/myevents');
  }

  TimeFromNow(time){
    return moment(time).fromNow()
  }

  addcomment(){
  	if(this.comment == "" || this.comment == undefined){
      this.presentToast('Please add some comment');
  	}else {
     if(this.url === 'newsfeed'){
       console.log(this.comment);
       if(this.comment.startsWith('@')){
         console.log('reply comment')
         // var cmtdata = this.comment.substr(this.comment.indexOf(' ')+1);
         // console.log(cmtdata);
         var replydata = {
           postId: this.replydata.postId,
           commentId : this.replydata.commentId,
           UserId: this.userData.id,
           userName: this.userData.userName,
           commentParentId: this.replydata.commentParentId,
           repliedBy: this.userData.id,
           comment: this.comment,
           parentComment: this.replydata.parentComment, 
           postImage: this.commentdata.media
         }
         console.log(replydata);
          this.apiService.replyCommentPost(replydata).subscribe(res => {
            console.log(res);
            this.comment = '';
            this.getpostbyPostid(this.commentdata._id);
            // this.socket.emit('refresh', {});
          })
       }else{
         var postdata = {
            postId: this.commentdata._id,
            userId: this.userData.id,
            userName: this.userData.fullName,
            comment: this.comment,
            postParentId: this.commentdata.userId,
            postImage: this.commentdata.media
          }
          console.log('comment')
          console.log(postdata);
            this.apiService.addCommentPost(postdata).subscribe(res => {
            console.log(res);
            this.comment = '';
            this.getpostbyPostid(this.commentdata._id);
            // this.socket.emit('refresh', {});
          })
       }
      // console.log(postdata);
      //   this.apiService.addCommentPost(postdata).subscribe(res => {
      //   console.log(res);
      //   this.comment = '';
      //   this.socket.emit('refresh', {});
      // })
     }
     if(this.url === 'event-cards'){
      var data = {
        eventid: this.commentdata._id,
        userId: this.userData.id,
        userName: this.userData.fullName,
        comment: this.comment
      }
      console.log(data);
        this.apiService.addCommentEvent(data).subscribe(res => {
        console.log(res);
        this.comment = '';
        this.getpostbyPostid(this.commentdata._id);
        // this.socket.emit('refresh', {});
      })
     }
  	}
  }

  likeUnlike(comment){
    console.log(comment);
    var data = {
      postId: this.commentdata._id,
      commentId: comment._id,
      UserId: this.userData.id,
      userName: this.userData.userName,
      commentParentId: comment.userId._id,
      comment: comment.comment,
      notificationType: 'comment'
    }
    console.log(data);
    this.apiService.likeUnlikeComment(data).subscribe(res => {
      console.log(res);
      this.getpostbyPostid(this.commentdata._id);
      // this.socket.emit('refresh', {});
    })
  }

  likeReply(comment){
    console.log(comment);
     var postId = this.commentdata._id;
     var replyId = comment._id;
     var data = {
       UserId : this.userData.id
     }
    this.apiService.likeCommentReply(postId,replyId,data).subscribe(res => {
      console.log(res);
      this.getpostbyPostid(this.commentdata._id);
      // this.socket.emit('refresh', {});
    })
  }

  unlikeReply(comment){
    console.log(comment);
     var postId = this.commentdata._id;
     var replyId = comment._id;
     var data = {
       UserId : this.userData.id
     }
    this.apiService.unlikeCommentReply(postId,replyId,data).subscribe(res => {
      console.log(res);
      this.getpostbyPostid(this.commentdata._id);
      // this.socket.emit('refresh', {});
    })
  }

  //   likeCommentReply(postId:any,replyId:any,param:any): Observable<any> {
  //   return this.http.post(environment.LikeCommentReplyUrl + "/" + postId + "/" +replyId, param)
  // }
  // unlikeCommentReply(postId:any,replyId:any,param:any): Observable<any> {
  //   return this.http.post(environment.unLikeCommentReplyUrl + "/" + postId + "/" +replyId, param)
  // }

  reply(reply){
    this.replydata = '';
    console.log(reply);
    this.myInput.setFocus();
    this.comment = '@' + reply.userName

    this.replydata = {
      postId: this.commentdata._id,
      commentId : reply._id,
      commentParentId: reply.userId._id,
      repliedBy: this.userData.id,
      parentComment: reply.comment
    }
    console.log(this.replydata);
  }

  nestedreply(reply){
    this.replydata = '';
    console.log(reply);
    this.myInput.setFocus();
    this.comment = '@' + reply.repliedBy.userName

    this.replydata = {
      postId: this.commentdata._id,
      commentId : reply.commentId,
      commentParentId: reply.commentParentId._id,
      repliedBy: this.userData.id
    }
    console.log(this.replydata);
  }

  onProfileClick(userdetails) {
    console.log(userdetails);
      // let navigationExtras: NavigationExtras = {
      //   queryParams: {
      //     data: JSON.stringify(userdetails),
      //     route: JSON.stringify(this.view)
      //   }
      // };
      // console.log(navigationExtras);
      // this.router.navigate(['/social/tabs/followhoomanprofile'],navigationExtras);
    }


  

}
