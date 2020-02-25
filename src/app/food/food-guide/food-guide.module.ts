import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodGuidePageRoutingModule } from './food-guide-routing.module';

import { FoodGuidePage } from './food-guide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodGuidePageRoutingModule
  ],
  declarations: [FoodGuidePage]
})
export class FoodGuidePageModule {}
