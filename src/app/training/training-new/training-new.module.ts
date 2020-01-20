import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrainingNewPageRoutingModule } from './training-new-routing.module';

import { TrainingNewPage } from './training-new.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingNewPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [TrainingNewPage]
})
export class TrainingNewPageModule {}
