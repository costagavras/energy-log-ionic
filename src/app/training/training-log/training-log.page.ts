import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { TrainingService } from '../training.service';
import { User, UserProfile } from '../../auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-training-log',
  templateUrl: './training-log.page.html',
  styleUrls: ['./training-log.page.scss'],
})
export class TrainingLogPage implements OnInit, OnDestroy {

  @ViewChild('myTable', { static: false }) table: any;

  funder = [];
  calculated = [];
  pending = [];
  groups = [];
  editing = {};

  exercisesTime: Exercise[];
  exercisesQty: Exercise[];
  exercisesCal: Exercise[];
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
  tableClass = 'dark';
  tableStyle = 'dark';


  constructor(private profileService: ProfileService,
              public trainingService: TrainingService,
              private authService: AuthService) { }

  ngOnInit() {

    this.trainingLogSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.updateFilteredDate();
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

    this.trainingLogSubs.push(this.trainingService.exercisesTimeChanged
      .subscribe(
        exercises => (this.exercisesTime = exercises)
      ));
    this.trainingService.fetchAvailableExercisesTime();

    this.trainingLogSubs.push(this.trainingService.exercisesQtyChanged
    .subscribe(
      exercises => (this.exercisesQty = exercises)
    ));
    this.trainingService.fetchAvailableExercisesQty();

    this.trainingLogSubs.push(this.trainingService.exercisesCalChanged
    .subscribe(
      exercises => (this.exercisesCal = exercises)
    ));
    this.trainingService.fetchAvailableExercisesCal();

  }

  updateFilteredDate() {
    this.trainingLogSubs.push(this.trainingService.finishedExercisesChanged
    .subscribe((exercises: Exercise[]) => {
      this.tableData = exercises;
      this.tableDataFilter = exercises;
    }));
    this.trainingService.fetchCompletedExercises(this.loggedUserProfile.userId);
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

    if (filterValue) {
      this.tableData = filteredData;
    } else {
      this.tableData = this.tableDataFilter;
    }
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
    // console.log('Toggled Expand Group!', group);
    const totalCaloriesGroup = group.value.map(ex => ex.caloriesOut).reduce((acc, value) => acc + value, 0);

    group.groupCalories = totalCaloriesGroup;
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {
    // console.log('Detail Toggled', event);
  }

  chkBoxGroup(val) {
    this.groupExpansion = val;
    console.log(this.groupExpansion);
  }

  ngOnDestroy() {
    if (this.trainingLogSubs) {
      this.trainingLogSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
