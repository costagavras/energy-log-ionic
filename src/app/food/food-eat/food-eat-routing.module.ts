import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodEatPage } from './food-eat.page';

const routes: Routes = [
  {
    path: '',
    component: FoodEatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodEatPageRoutingModule {}
