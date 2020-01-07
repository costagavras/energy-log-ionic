import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit, OnDestroy {
  unitsFormGroup: FormGroup;

  loggedUser: User;
  userCreated = false;
  private appSettingSubs: Subscription[] = [];

  constructor(private router: Router,
              private profileService: ProfileService,
              private authService: AuthService) { }

  ngOnInit() {

    this.appSettingSubs.push(this.authService.user // getter
      .subscribe(user => {
        this.loggedUser = user;
        this.profileService.getUserData(this.loggedUser.id);
      })
    );

    this.unitsFormGroup = new FormGroup({
      units: new FormControl('metric', {validators: [Validators.required]}) // default value, if profile not created
    });

    // doesn't come to here if user not created
    this.appSettingSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          if (userProfileData) {
            this.unitsFormGroup.patchValue({units: typeof userProfileData.units !== 'undefined' ? userProfileData.units : 'metric' });
            this.profileService.unitsSelected(this.unitsFormGroup.value.units); // sends to UserData current state with no buttons touched
            typeof userProfileData !== 'undefined' ? this.userCreated = true : this.userCreated = false;
         }
        }
      )
    );
  }

  onSave() {
    if (this.userCreated) {
      this.profileService.addOrUpdateUser({
        units: this.unitsFormGroup.value.units,
        userId: this.loggedUser.id
      });
    }
    this.router.navigateByUrl('profile/user-data');
      // .then(() => {
      //   this.profileService.unitsSelected(this.unitsFormGroup.value.units); // if save button is clicked;
      // });
  }

  unitChange(units: string) {
    this.profileService.unitsSelected(units); // if radio button is clicked
  }

  ionViewDidLeave() {
    this.profileService.unitsSelected(this.unitsFormGroup.value.units);
    this.userCreated = false;
    if (this.appSettingSubs) {
      this.appSettingSubs.forEach(sub => sub.unsubscribe());
    }
  }

  ionViewWillLeave() {
    this.profileService.cancelSubscriptions();
  }

  ngOnDestroy() {
    if (this.appSettingSubs) {
      this.appSettingSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
