import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingPage } from './training.page';

const routes: Routes = [
  { path: '', component: TrainingPage,
    children: [
      { path: 'training-new', loadChildren: () => import('./training-new/training-new.module').then( m => m.TrainingNewPageModule) },
      { path: 'training-log', loadChildren: () => import('./training-log/training-log.module').then( m => m.TrainingLogPageModule) }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingPageRoutingModule {}
