import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDataPageRoutingModule } from './user-data-routing.module';

import { UserDataPage } from './user-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UserDataPageRoutingModule
  ],
  declarations: [UserDataPage]
})
export class UserDataPageModule {}
