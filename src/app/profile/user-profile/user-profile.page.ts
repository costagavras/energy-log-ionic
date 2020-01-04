import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { User, UserProfile } from '../../auth/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit, OnDestroy {

  private profileSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;


  constructor(private router: Router,
              private profileService: ProfileService,
              private authService: AuthService) { }

  ngOnInit() {
    this.profileSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        this.profileService.getUserData(this.loggedUser.id); // event emitter for sub at line 57;
      })
    );

    this.profileSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
      })
    );
  }

  goBack() {
    this.router.navigateByUrl('profile/user-data');
  }

  deleteUser(user: UserProfile) {
    this.profileService.deleteProfile(user);
  }

  ngOnDestroy() {
    if (this.profileSubs) {
      this.profileSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
