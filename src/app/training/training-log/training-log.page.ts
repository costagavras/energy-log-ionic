import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';

import { Subscription } from 'rxjs';

import { ProfileService } from '../../profile/profile.service';
import { TrainingService } from '../training.service';
import { AuthService } from '../../auth/auth.service';

import { User, UserProfile } from '../../auth/user.model';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-training-log',
  templateUrl: './training-log.page.html',
  styleUrls: ['./training-log.page.scss'],
})
export class TrainingLogPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myTable', { static: false }) table: any;
  @ViewChildren('groupSummary') groupSum: QueryList<any>;

  private trainingLogSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;

  // table styling
  groupExpansion = false;
  tableData: Exercise[];
  tableDataFilter: Exercise[];
  columns = [
              { name: 'Date', prop: 'dateStr'},
              { name: 'Name', prop: 'name'},
              { name: 'Calories', prop: 'caloriesOut'},
              { name: 'Duration', prop: 'duration'},
              { name: 'Quantity', prop: 'quantity'}
            ];
  colAction = [{ name: 'Actions', prop: 'actions'}];
  allColumns = [
              { name: 'Date', prop: 'dateStr'},
              { name: 'Name', prop: 'name'},
              { name: 'Calories', prop: 'caloriesOut'},
              { name: 'Duration', prop: 'duration'},
              { name: 'Quantity', prop: 'quantity'}
            ];
  allAction = [{ name: 'Actions', prop: 'actions'}];

  tableClass = 'light';
  tableStyle = 'light';


  constructor(private profileService: ProfileService,
              public trainingService: TrainingService,
              private authService: AuthService) { }

  ngOnInit() {

    this.trainingLogSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.fetchAllExercises(this.loggedUserProfile.userId);
      })
    );

    this.trainingLogSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

  }

  // will add total calories count per group after the table loads
  ngAfterViewInit() {
    this.trainingLogSubs.push(this.groupSum.changes.subscribe(result => {
      if (this.table.groupedRows) {
        setTimeout(() => { // to avoid expression has changed after it was checked
          this.table.groupedRows.map(group => {
            const totalCaloriesGroup = group.value.map(ex => ex.caloriesOut).reduce((acc, value) => acc + value, 0);
            group.groupCalories = totalCaloriesGroup;
          }, 1);
        });
      }
    }));
  }

  fetchAllExercises(userFirebaseId: string) {
    this.trainingLogSubs.push(this.trainingService.finishedExercisesChanged
    .subscribe((exercises: Exercise[]) => {
      this.tableData = exercises;
      this.tableDataFilter = exercises;
    }));
    this.trainingService.fetchCompletedExercises(userFirebaseId);
  }

  switchStyle() {
    if (this.tableClass === 'dark') {
      this.tableClass = 'bootstrap';
      this.tableStyle = 'light';
    } else {
      this.tableClass = 'dark';
      this.tableStyle = 'dark';
    }
  }

  doFilter(filterValue: string) {
    const filteredValue = filterValue.trim().toLowerCase();
    const filteredData = [...this.tableDataFilter].filter(val => {
      return val.name.toLowerCase().indexOf(filteredValue) !== -1 || !filteredValue;
    });

    filterValue ? this.tableData = filteredData : this.tableData = this.tableDataFilter;
  }

  toggle(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
  }

  toggleAction(col) {
    const isChecked = this.isCheckedAction(col);

    if (isChecked) {
      this.colAction = this.colAction.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.colAction = [...this.colAction, col];
    }
  }

  // if found returns true, else false (if c.name = undefined)
  isChecked(col) {
    return (
      this.columns.find(c => {
        return c.name === col.name;
      }) !== undefined
    );
  }

  // if found returns true, else false (if c.name = undefined)
  isCheckedAction(col) {
    return (
      this.colAction.find(c => {
        return c.name === col.name;
      }) !== undefined
    );
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  toggleAllGroups() {
    this.table.groupedRows.map(group => this.table.groupHeader.toggleExpandGroup(group));
  }

  ngOnDestroy() {
    if (this.trainingLogSubs) {
      this.trainingLogSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
