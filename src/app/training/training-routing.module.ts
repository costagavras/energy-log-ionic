import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingPage } from './training.page';

const routes: Routes = [
  { path: '', component: TrainingPage,
    children: [
      // tslint:disable-next-line: max-line-length
      { path: 'training-guide', loadChildren: () => import('./training-guide/training-guide.module').then( m => m.TrainingGuidePageModule) },
      { path: 'training-new', loadChildren: () => import('./training-new/training-new.module').then( m => m.TrainingNewPageModule) },
      { path: 'training-log', loadChildren: () => import('./training-log/training-log.module').then( m => m.TrainingLogPageModule) },
      { path: '', redirectTo: '/training/training-new', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingPageRoutingModule {}
