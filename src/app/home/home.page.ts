import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { ProfileService } from '../profile/profile.service';
import { AuthService } from '../auth/auth.service';
import { User, UserProfile } from '../auth/user.model';

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
              public profileService: ProfileService) { }

  ngOnInit() {

    this.homeSubscriptions.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
      })
    );

    this.homeSubscriptions.push(this.profileService.userProfileData
      .subscribe(userProfileData => {
          this.loggedUserProfile = userProfileData;
      })
    );

  }

  ngOnDestroy() {
    if (this.homeSubscriptions) {
      this.homeSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }

}
