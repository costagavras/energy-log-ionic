import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserActivityLevelPageRoutingModule } from './user-activity-level-routing.module';

import { UserActivityLevelPage } from './user-activity-level.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UserActivityLevelPageRoutingModule
  ],
  declarations: [UserActivityLevelPage]
})
export class UserActivityLevelPageModule {}
