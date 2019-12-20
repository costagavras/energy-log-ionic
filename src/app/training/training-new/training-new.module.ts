import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingNewPageRoutingModule } from './training-new-routing.module';

import { TrainingNewPage } from './training-new.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingNewPageRoutingModule
  ],
  declarations: [TrainingNewPage]
})
export class TrainingNewPageModule {}
