import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  // loadingStateChanged = new Subject<boolean>();

  constructor(private toastController: ToastController) {}

  async showToast(messageToast, durationToast) {
      const toast = await this.toastController.create({
        message: messageToast,
        duration: durationToast
      });
      toast.present();
  }


}