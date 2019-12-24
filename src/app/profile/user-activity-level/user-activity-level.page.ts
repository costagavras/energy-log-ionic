import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-activity-level',
  templateUrl: './user-activity-level.page.html',
  styleUrls: ['./user-activity-level.page.scss'],
})
export class UserActivityLevelPage implements OnInit {
  activities = ['agricultural work (planting, weeding, gathering)', 'costruction', 'cooking', 'eating', 'exercising', 'reading'];

  constructor() { }

  ngOnInit() {
  }

}
