import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodGuidePage } from './food-guide.page';

const routes: Routes = [
  {
    path: '',
    component: FoodGuidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodGuidePageRoutingModule {}
