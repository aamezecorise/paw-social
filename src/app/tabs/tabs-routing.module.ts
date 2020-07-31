import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { EventCardsPage } from '../event-cards/event-cards.page';
// import { CreateEventPage } from '../create-event/create-event.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'newsfeed',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../newsfeed/newsfeed.module').then(m => m.NewsfeedPageModule)
          }
        ]
      },
      {
        path: 'saved',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../saved/saved.module').then(m => m.SavedPageModule)
          }
        ]
      },
      {
        path: 'event-cards',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../event-cards/event-cards.module').then(m =>  m.EventCardsPageModule)
          }
        ]
      },
      {
        path: 'petprofile',
        children: [
          {
            path: '',
            loadChildren: () =>
              // import('/petprofile/petprofile.module#PetprofilePageModule').then(m =>  m.PetprofilePageModule)
              import('../petprofile/petprofile.module').then(m => m.PetprofilePageModule)
          }
        ]
      },

      {
        path: 'followhoomanprofile',
        children: [
          {
            path: '',
            loadChildren: () =>
              // import('/petprofile/petprofile.module#PetprofilePageModule').then(m =>  m.PetprofilePageModule)
              import('../followhoomanprofile/followhoomanprofile.module').then(m => m.FollowhoomanprofilePageModule)
          }
        ]
      },

      {
        path: 'postdetails',
        children: [
          {
            path: '',
            loadChildren: () =>
              // import('/petprofile/petprofile.module#PetprofilePageModule').then(m =>  m.PetprofilePageModule)
              import('../postdetails/postdetails.module').then(m => m.PostdetailsPageModule)
          }
        ]
      },

      {
        path: 'likes',
        children: [
          {
            path: '',
            loadChildren: () =>
              // import('/petprofile/petprofile.module#PetprofilePageModule').then(m =>  m.PetprofilePageModule)
              import('../likes/likes.module').then(m => m.LikesPageModule)
          }
        ]
      },

      {
        path: 'followunfollow',
        children: [
          {
            path: '',
            loadChildren: () =>
              // import('/petprofile/petprofile.module#PetprofilePageModule').then(m =>  m.PetprofilePageModule)
              import('../followunfollow/followunfollow.module').then(m => m.FollowunfollowPageModule)
          }
        ]
      },

      {
        path: 'petfollowers',
        children: [
          {
            path: '',
            loadChildren: () =>
              // import('/petprofile/petprofile.module#PetprofilePageModule').then(m =>  m.PetprofilePageModule)
              import('../petfollowers/petfollowers.module').then(m => m.PetfollowersPageModule)
          }
        ]
      },

      {
        path: 'pet-owner',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pet-owner/pet-owner.module').then(m =>  m.PetOwnerPageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab4/tab4.module').then(m => m.Tab4PageModule)
          }
        ]
      },
      {
        path: 'canvas',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../canvas/canvas.module').then(m => m.CanvasPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/newsfeed',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/newsfeed',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
