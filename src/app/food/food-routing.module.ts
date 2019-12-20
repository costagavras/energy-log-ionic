import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodPage } from './food.page';

const routes: Routes = [
  { path: '', component: FoodPage,
    children: [
      { path: 'food-eat', loadChildren: () => import('./food-eat/food-eat.module').then( m => m.FoodEatPageModule) },
      { path: 'food-log', loadChildren: () => import('./food-log/food-log.module').then( m => m.FoodLogPageModule) },
      { path: 'food-manage', loadChildren: () => import('./food-manage/food-manage.module').then( m => m.FoodManagePageModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodPageRoutingModule {}
