import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit, OnDestroy {
  @Output() tabSelected = new EventEmitter<void>();

  userDataFormGroup: FormGroup;

  bmi = 0;
  bmr = 0;
  loadLinkToActivityLevel = false;
  fbUser;
  units = 'imperial';
  height: number;
  weight: number;
  private anthropometrySubs: Subscription[] = [];

  constructor(private router: Router) { }

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

  get name() { return this.userDataFormGroup.get('nameCtrl'); }
  get gender() { return this.userDataFormGroup.get('genderCtrl'); }
  get age() { return this.userDataFormGroup.get('ageCtrl'); }
  get weightKg() { return this.userDataFormGroup.get('weightKgCtrl'); }
  get weightLb() { return this.userDataFormGroup.get('weightLbCtrl'); }
  get heightCm() { return this.userDataFormGroup.get('heightCmCtrl'); }
  get heightFt() { return this.userDataFormGroup.get('heightFtCtrl'); }
  get heightIn() { return this.userDataFormGroup.get('heightInCtrl'); }

  calculate_BMI_BMR() {
    // this.calculateHeightWeight();
    // this.bmi = this.profileService.calcBMI(this.weight, this.height / 100);
    // this.bmr = this.profileService.calcBMR(
    //   this.genderFormGroup.value.gender, this.ageFormGroup.value.age, this.weight, this.height);
  }

  onSave() {
    console.log(this.userDataFormGroup.value);

    this.calculate_BMI_BMR();
    // this.profileService.addOrUpdateUser({
    //   email: this.fbUser.email,
    //   userId: this.fbUser.uid,
    //   name: this.nameFormGroup.value.name,
    //   gender: this.genderFormGroup.value.gender,
    //   age: this.ageFormGroup.value.age,
    //   weight: this.weight,
    //   height: this.height,
    //   units: this.units,
    //   bmi: this.bmi,
    //   bmr: this.bmr,
    // });
    // this.loadLinkToActivityLevel = true;
    this.router.navigateByUrl('profile/user-activity-level');
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

  tabSelect() {
    this.tabSelected.emit();
  }

  ngOnDestroy() {
    if (this.anthropometrySubs) {
      this.anthropometrySubs.forEach(sub => sub.unsubscribe());
    }
  }

}
