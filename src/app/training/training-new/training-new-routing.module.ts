import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrainingNewPage } from './training-new.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingNewPageRoutingModule {}
