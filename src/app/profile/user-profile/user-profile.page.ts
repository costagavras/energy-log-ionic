import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { User, UserProfile } from '../../auth/user.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit, OnDestroy {

  private profileSubs: Subscription[] = [];
  loggedUser: User;
  loggedUserProfile: UserProfile;


  constructor(private router: Router,
              private profileService: ProfileService,
              private authService: AuthService,
              private alertController: AlertController) { }

  ngOnInit() {}

  ionViewWillEnter() {

    this.profileSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
      })
    );

    this.profileSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

  }

  goBack() {
    this.router.navigateByUrl('profile/user-data');
  }

  deleteUser(user: UserProfile) {

    if (this.loggedUserProfile) {
      this.alertController.create({
        header: 'Delete this user data?',
        cssClass: 'alert_delete_user',
        buttons: [{
                    text: 'Confirm',
                    handler: () => {
                      this.profileService.deleteProfile(user);
                    }
                  },
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  }]
      })
      .then(alertDelete => {
        alertDelete.present();
      });
    }
  }


  ionViewDidLeave() {
    if (this.profileSubs) {
      this.profileSubs.forEach(sub => sub.unsubscribe());
    }
  }

  ngOnDestroy() {
    if (this.profileSubs) {
      this.profileSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
