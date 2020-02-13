import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { User } from '../../auth/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit, OnDestroy {

  userDataFormGroup: FormGroup;

  bmi = 0;
  bmr = 0;
  loggedUser: User;
  dataSaved = false;
  units = 'metric'; // needed to initialize the view with ngIf === metric
  height: number;
  weight: number;
  private anthropometrySubs: Subscription[] = [];

  constructor(private router: Router,
              private profileService: ProfileService,
              private authService: AuthService) { }

  ngOnInit() {

    this.userDataFormGroup = new FormGroup({
      nameCtrl: new FormControl('', {validators: [Validators.required]}),
      genderCtrl: new FormControl('female', {validators: [Validators.required]}),
      ageCtrl: new FormControl('', {validators: [Validators.required, Validators.min(10), Validators.max(130)]}),
      heightCmCtrl: new FormControl('', {validators: [Validators.required, Validators.min(90), Validators.max(290)]}),
      heightFtCtrl: new FormControl('', {validators: [Validators.required, Validators.min(3), Validators.max(7)]}),
      heightInCtrl: new FormControl('', {validators: [Validators.required, Validators.min(0), Validators.max(11)]}),
      weightKgCtrl: new FormControl('', {validators: [Validators.required, Validators.min(20), Validators.max(320)]}),
      weightLbCtrl: new FormControl('', {validators: [Validators.required, Validators.min(50), Validators.max(750)]})
    });

  }

  ionViewWillEnter() {

    this.anthropometrySubs.push(this.profileService.unitsUserSelected
      .subscribe(units => {
          this.units = units;
        }
      )
    );

    this.anthropometrySubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

    this.anthropometrySubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          if (userProfileData) {
            this.userDataFormGroup.patchValue({nameCtrl: typeof userProfileData.name !== 'undefined' ? userProfileData.name : null });
            this.userDataFormGroup.patchValue({genderCtrl: typeof userProfileData.gender !== 'undefined' ? userProfileData.gender : null });
            this.userDataFormGroup.patchValue({ageCtrl: typeof userProfileData.age !== 'undefined' ? userProfileData.age : null });
            this.userDataFormGroup.patchValue({
              heightCmCtrl: typeof userProfileData.height !== 'undefined' ? userProfileData.height : null });
            this.userDataFormGroup.patchValue({
              heightFtCtrl: typeof userProfileData.height !== 'undefined' ? Math.floor(userProfileData.height / 30.4) : null });
            this.userDataFormGroup.patchValue({
              heightInCtrl: typeof userProfileData.height !== 'undefined' ?
              Math.round((userProfileData.height - Math.floor(userProfileData.height / 30.4) * 30.4) / 2.54) : null });
            this.userDataFormGroup.patchValue({
              weightKgCtrl: typeof userProfileData.weight !== 'undefined' ? userProfileData.weight : null });
            this.userDataFormGroup.patchValue({
              weightLbCtrl: typeof userProfileData.weight !== 'undefined' ? Math.round(userProfileData.weight / 0.454) : null });
          }
        }
      )
    );

  }

  get name() { return this.userDataFormGroup.get('nameCtrl'); }
  get gender() { return this.userDataFormGroup.get('genderCtrl'); }
  get age() { return this.userDataFormGroup.get('ageCtrl'); }
  get weightKg() { return this.userDataFormGroup.get('weightKgCtrl'); }
  get weightLb() { return this.userDataFormGroup.get('weightLbCtrl'); }
  get heightCm() { return this.userDataFormGroup.get('heightCmCtrl'); }
  get heightFt() { return this.userDataFormGroup.get('heightFtCtrl'); }
  get heightIn() { return this.userDataFormGroup.get('heightInCtrl'); }

  calculate_BMI_BMR() {
    this.calculateHeightWeight();
    this.bmi = this.calcBMI(this.weight, this.height / 100);
    this.bmr = this.calcBMR(
      this.userDataFormGroup.value.genderCtrl, this.userDataFormGroup.value.ageCtrl, this.weight, this.height);
  }

  calculateHeightWeight() {
    if (this.units === 'metric') {
      this.height = this.userDataFormGroup.value.heightCmCtrl;
      this.weight = this.userDataFormGroup.value.weightKgCtrl;
    } else  {
      this.height = Math.round(this.userDataFormGroup.value.heightFtCtrl * 30.4 + this.userDataFormGroup.value.heightInCtrl * 2.54);
      this.weight = Math.round(this.userDataFormGroup.value.weightLbCtrl * 0.454);
    }
  }

  calcBMI(weight, height) {
    return Math.round((weight / (height * height)) * 10) / 10;
  }

  calcBMR(gender, age, weight, height) {
    // Mifflin St Jeor
    return Math.round(10 * weight + 6.25 * height - 5 * age + (gender === 'female' ? - 161 : + 5) );
  }

  onSave() {
    this.calculate_BMI_BMR();
    this.anthropometrySubs.push(this.profileService.dataSaved // have to sub before emit event
      .subscribe(dataOk => {
          this.dataSaved = dataOk;
          if (this.dataSaved) {
            this.router.navigateByUrl('profile/user-activity-level');
            //   .then(() => {
            //     this.profileService.getUserData(this.loggedUser.id); // if save button is clicked
            // });
            this.userDataFormGroup.reset();
          }
        }
      )
    );
    this.profileService.addOrUpdateUser({ // emit event dataSaved in profileService
      email: this.loggedUser.userEmail,
      userId: this.loggedUser.id,
      name: this.userDataFormGroup.value.nameCtrl,
      gender: this.userDataFormGroup.value.genderCtrl,
      age: this.userDataFormGroup.value.ageCtrl,
      weight: this.weight,
      height: this.height,
      units: this.units,
      bmi: this.bmi,
      bmr: this.bmr,
    });
  }

  ionViewDidLeave() {
    this.profileService.getUserData(this.loggedUser.id); // if save button is clicked
    this.profileService.getActivitiesList();
    if (this.anthropometrySubs) {
      this.anthropometrySubs.forEach(sub => sub.unsubscribe());
    }
  }

  ionViewWillLeave() {
    this.profileService.cancelSubscriptions();
  }

  ngOnDestroy() {
    if (this.anthropometrySubs) {
      this.anthropometrySubs.forEach(sub => sub.unsubscribe());
    }
  }

}
