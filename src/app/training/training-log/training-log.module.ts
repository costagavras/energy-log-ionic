import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingLogPageRoutingModule } from './training-log-routing.module';

import { TrainingLogPage } from './training-log.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingLogPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [TrainingLogPage]
})
export class TrainingLogPageModule {}
