import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-activity-level',
  templateUrl: './user-activity-level.page.html',
  styleUrls: ['./user-activity-level.page.scss'],
})
export class UserActivityLevelPage implements OnInit {
  listActivities = ['agricultural work (planting, weeding, gathering)', 'costruction', 'cooking', 'eating', 'exercising', 'reading'];
  minValue = 0;
  maxValue = 24;
  total: any = 0;
  userActivityFormGroup: FormGroup;

  constructor(private router: Router) { }

  ngOnInit() {
    const formDataObject = {};
    let i = 0;
    for (const property of this.listActivities) {
      formDataObject[`hoursControl_${i}`] = new FormControl('0', {validators: [Validators.min(0), Validators.max(24)]});
      i++;
    }
    this.userActivityFormGroup = new FormGroup(formDataObject);
  }

  onSave() {
    // this.profileService.calcRMR(this.listActivities, Object.values(form.value));
    // this.loadLinkToProfileCompleted = true;
    this.router.navigateByUrl('profile/user-profile');
  }

  sumHours() {
    // 0 stands for initial value
    this.total = Object.values(this.userActivityFormGroup.value).reduce((a: number, b: number) => +a + +b, 0);
  }

}
