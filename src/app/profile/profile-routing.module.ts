import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  { path: '',
    component: ProfilePage,
    children: [
      { path: 'user-settings', loadChildren: () => import('./user-settings/user-settings.module').then( m => m.UserSettingsPageModule) },
      { path: 'user-data', loadChildren: () => import('./user-data/user-data.module').then( m => m.UserDataPageModule) },
      // tslint:disable-next-line: max-line-length
      { path: 'user-activity-level', loadChildren: () => import('./user-activity-level/user-activity-level.module').then( m => m.UserActivityLevelPageModule) },
      { path: 'user-profile', loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
