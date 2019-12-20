import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingLogPage } from './training-log.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingLogPageRoutingModule {}
