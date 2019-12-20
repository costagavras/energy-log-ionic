import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodManagePage } from './food-manage.page';

const routes: Routes = [
  {
    path: '',
    component: FoodManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodManagePageRoutingModule {}
