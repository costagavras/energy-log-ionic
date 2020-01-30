import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { AuthService } from '../auth/auth.service';
import { User, UserProfile } from '../auth/user.model';
import { UIService } from '../shared/ui.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  loggedUser: User;
  loggedUserProfile: UserProfile;
  homeSubscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
              public profileService: ProfileService,
              private uiService: UIService,
              private alertController: AlertController) { }

  ngOnInit() {

    this.homeSubscriptions.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

    this.homeSubscriptions.push(this.profileService.userProfileData
      .subscribe(userProfileData => {
          this.loggedUserProfile = userProfileData;
      })
    );

  }

  deleteUserAccount(user) {
    if (user) {
      this.alertController.create({
        header: 'Delete this user?',
        buttons: [{
                    text: 'Confirm',
                    handler: () => {
                      this.deleteUserAccountFirebase(user);
                    }
                  },
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  }]
      })
      .then(alertDelete => {
        alertDelete.present();
      })
        .catch(err => {
          console.log(err);
        });
    }
  }

  deleteUserAccountFirebase(user) {
    this.authService.deleteUser(user.token)
    .toPromise().then(() => {
        this.authService.logout();
        this.uiService.showToast('This account is now gone!', 3000);
      }).catch(errorResponse => {
        const errorMsg = errorResponse.error.error.message;
        let message = 'Could not delete the user, please try again.';
        if (errorMsg === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN' || errorMsg === 'INVALID_ID_TOKEN') {
          message = 'Please, logout and sign in again to delete the user account';
        } else if (errorMsg === 'USER_NOT_FOUND') {
          message = 'The user has been successfully deleted!';
        }
        this.uiService.showToast(message, 3000);
      });
  }

  ngOnDestroy() {
    if (this.homeSubscriptions) {
      this.homeSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }

}
