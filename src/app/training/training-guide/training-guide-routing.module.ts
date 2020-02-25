import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingGuidePage } from './training-guide.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingGuidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingGuidePageRoutingModule {}
