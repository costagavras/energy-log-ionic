import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodEatPageRoutingModule } from './food-eat-routing.module';

import { FoodEatPage } from './food-eat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodEatPageRoutingModule
  ],
  declarations: [FoodEatPage]
})
export class FoodEatPageModule {}
