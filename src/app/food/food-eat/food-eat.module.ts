import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodEatPageRoutingModule } from './food-eat-routing.module';

import { FoodEatPage } from './food-eat.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodEatPageRoutingModule,
    NgxDatatableModule
  ],
  exports: [],
  declarations: [FoodEatPage],
  entryComponents: [],
})
export class FoodEatPageModule {}
