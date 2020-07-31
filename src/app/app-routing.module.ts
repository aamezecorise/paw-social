import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthGuard2, SessionGuard} from './service/auth-guard.service';

const routes: Routes = [


  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [SessionGuard] },
  // // { path: 'tabs', loadChildren: './tabs/tabs.module.module#TabsPageModule' },
  // { path: 'newsfeed', loadChildren: './newsfeed/newsfeed.module#NewsfeedPageModule' },
  // { path: 'create-event', loadChildren: './create-event/create-event.module#CreateEventPageModule', canActivate: [AuthGuard] },
  // { path: 'camera-preview', loadChildren: './camera-preview/camera-preview.module#CameraPreviewPageModule' },
  // { path: 'video-preview', loadChildren: './video-preview/video-preview.module#VideoPreviewModule' },
  // { path: 'textpost', loadChildren: './textpost/textpost.module#TextpostModule' },
  // { path: 'followrequest', loadChildren: './followrequest/followrequest.module#FollowrequestModule' },
  // { path: 'event-cards', loadChildren: './event-cards/event-cards.module#EventCardsPageModule',canActivate: [AuthGuard] },
  // { path: 'event-invitation', loadChildren: './event-invitation/event-invitation.module#EventInvitationPageModule',canActivate: [AuthGuard] },
  // { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  // { path: 'event-join', loadChildren: './event-join/event-join.module#EventJoinPageModule',canActivate: [AuthGuard] },
  // { path: 'event-preview', loadChildren: './event-preview/event-preview.module#EventPreviewPageModule',canActivate: [AuthGuard] },
  // { path: 'pet-owner', loadChildren: './pet-owner/pet-owner.module#PetOwnerPageModule' },
  // { path: 'add-new-post', loadChildren: './add-new-post/add-new-post.module#AddNewPostPageModule' },
  // { path: 'explore', loadChildren: './explore/explore.module#ExploreModule' },
  // { path: 'canvas', loadChildren: './canvas/canvas.module#CanvasPageModule' },
  // { path: 'petprofile', loadChildren: './petprofile/petprofile.module#PetprofilePageModule' },
  // { path: 'petprofile-create', loadChildren: './petprofile-create/petprofile-create.module#PetprofileCreatePageModule' },
  // { path: 'myevents', loadChildren: './myevents/myevents.module#MyeventsPageModule',canActivate: [AuthGuard] },
  // { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [AuthGuard2]},
  // { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [SessionGuard]},
  // { path: 'eventbookmark', loadChildren: './eventbookmark/eventbookmark.module#EventbookmarkPageModule',canActivate: [AuthGuard] },
  // { path: 'peoplejoinedpage', loadChildren: './peoplejoinedpage/peoplejoinedpage.module#PeoplejoinedpagePageModule',canActivate: [AuthGuard] },
  // { path: 'eventcomments', loadChildren: './eventcomments/eventcomments.module#EventcommentsPageModule',canActivate: [AuthGuard] },
  // { path: 'saved', loadChildren: './saved/saved.module#SavedPageModule' },
  // { path: 'postdetails', loadChildren: './postdetails/postdetails.module#PostdetailsPageModule' },
  // { path: 'likes', loadChildren: './likes/likes.module#LikesPageModule' },



  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  // { path: 'tabs', loadChildren: './tabs/tabs.module.module#TabsPageModule' },
  { path: 'social', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)},
  { path: 'newsfeed', loadChildren: './newsfeed/newsfeed.module#NewsfeedPageModule' },
  { path: 'create-event', loadChildren: './create-event/create-event.module#CreateEventPageModule' },
  { path: 'camera-preview', loadChildren: './camera-preview/camera-preview.module#CameraPreviewPageModule' },
  { path: 'video-preview', loadChildren: './video-preview/video-preview.module#VideoPreviewModule' },
  { path: 'textpost', loadChildren: './textpost/textpost.module#TextpostModule' },
  { path: 'followrequest', loadChildren: './followrequest/followrequest.module#FollowrequestModule' },
  { path: 'event-cards', loadChildren: './event-cards/event-cards.module#EventCardsPageModule' },
  { path: 'event-invitation', loadChildren: './event-invitation/event-invitation.module#EventInvitationPageModule' },
  { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  { path: 'event-join', loadChildren: './event-join/event-join.module#EventJoinPageModule' },
  { path: 'event-preview', loadChildren: './event-preview/event-preview.module#EventPreviewPageModule' },
  { path: 'pet-owner', loadChildren: './pet-owner/pet-owner.module#PetOwnerPageModule' },
  { path: 'add-new-post', loadChildren: './add-new-post/add-new-post.module#AddNewPostPageModule' },
  { path: 'explore', loadChildren: './explore/explore.module#ExploreModule' },
  { path: 'canvas', loadChildren: './canvas/canvas.module#CanvasPageModule' },
  { path: 'petprofile', loadChildren: './petprofile/petprofile.module#PetprofilePageModule' },
  { path: 'petprofile-create', loadChildren: './petprofile-create/petprofile-create.module#PetprofileCreatePageModule' },
  { path: 'myevents', loadChildren: './myevents/myevents.module#MyeventsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'eventbookmark', loadChildren: './eventbookmark/eventbookmark.module#EventbookmarkPageModule' },
  { path: 'peoplejoinedpage', loadChildren: './peoplejoinedpage/peoplejoinedpage.module#PeoplejoinedpagePageModule' },
  { path: 'eventcomments', loadChildren: './eventcomments/eventcomments.module#EventcommentsPageModule' },
  { path: 'followhoomanprofile', loadChildren: './followhoomanprofile/followhoomanprofile.module#FollowhoomanprofilePageModule' },
  { path: 'followunfollow', loadChildren: './followunfollow/followunfollow.module#FollowunfollowPageModule' },
  { path: 'petfollowers', loadChildren: './petfollowers/petfollowers.module#PetfollowersPageModule' },
  { path: 'saved', loadChildren: './saved/saved.module#SavedPageModule' },
  { path: 'postdetails', loadChildren: './postdetails/postdetails.module#PostdetailsPageModule' },
  { path: 'likes', loadChildren: './likes/likes.module#LikesPageModule' },









];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
