import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingGuidePageRoutingModule } from './training-guide-routing.module';

import { TrainingGuidePage } from './training-guide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingGuidePageRoutingModule
  ],
  declarations: [TrainingGuidePage]
})
export class TrainingGuidePageModule {}
