import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodManagePageRoutingModule } from './food-manage-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { FoodManagePage } from './food-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodManagePageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [FoodManagePage]
})
export class FoodManagePageModule {}
