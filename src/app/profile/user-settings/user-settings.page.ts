import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit, OnDestroy {
  @Output() tabSelected = new EventEmitter<void>();
  unitsFormGroup: FormGroup;

  constructor(private router: Router) { }

  ngOnInit() {
    this.unitsFormGroup = new FormGroup({
      units: new FormControl('metric', {validators: [Validators.required]})
    });
  }

  onSave() {
    this.tabSelected.emit();
    console.log(this.unitsFormGroup.value.units);
    // this.profileService.unitsSelected(this.unitsFormGroup.value.units); // if save button is clicked
    // if (this.userCreated) {
    //   this.profileService.addOrUpdateUser({
    //     units: this.unitsFormGroup.value.units,
    //     userId: this.fbUser.uid
    //   });
    // }
    this.router.navigateByUrl('profile/user-data');
  }

  unitChange(units: string) {
    console.log(units);
    // this.profileService.unitsSelected($event.value); // if radio button is clicked
  }

  ngOnDestroy() {}

}
