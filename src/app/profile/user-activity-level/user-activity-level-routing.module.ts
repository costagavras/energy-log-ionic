import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserActivityLevelPage } from './user-activity-level.page';

const routes: Routes = [
  {
    path: '',
    component: UserActivityLevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActivityLevelPageRoutingModule {}
