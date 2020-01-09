import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { UserProfile, User } from './auth/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  loggedUser: User;
  loggedUserProfile: UserProfile;
  appSubscriptions: Subscription[] = [];
  private previousAuthState = false;

  constructor(public authService: AuthService,
              private router: Router,
              private profileService: ProfileService) {}

  ngOnInit() {

    this.appSubscriptions.push(this.profileService.userProfileData
      .subscribe(userProfileData => {
          this.loggedUserProfile = userProfileData;
      })
    );

    this.appSubscriptions.push(this.authService.userIsAuthenticated // getter, not event emitter
        .subscribe(isAuthenticated => {
          if (!isAuthenticated && this.previousAuthState !== isAuthenticated) {
              this.router.navigateByUrl('/auth');
              this.isLoggedIn = false;
          } else if (isAuthenticated) {
              this.isLoggedIn = true;
              this.appSubscriptions.push(this.authService.user // getter, not event emitter
                .subscribe(user => {
                  this.loggedUser = user;
                  this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
                })
            );
          }
          this.previousAuthState = isAuthenticated;
        })
    );

  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.appSubscriptions) {
      this.appSubscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}
