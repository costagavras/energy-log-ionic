import { Component, OnInit, OnDestroy, ViewChildren, ViewChild, QueryList, AfterViewInit } from '@angular/core';

import { ProfileService } from '../../profile/profile.service';
import { AuthService } from '../../auth/auth.service';
import { FoodService } from '../food.service';

import { Subscription } from 'rxjs';

import { User, UserProfile } from '../../auth/user.model';
import { FoodItem } from '../food-item.model';

@Component({
  selector: 'app-food-log',
  templateUrl: './food-log.page.html',
  styleUrls: ['./food-log.page.scss'],
})
export class FoodLogPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myTable', { static: false }) table: any;
  @ViewChildren('groupSummary') groupSum: QueryList<any>;

  private foodLogSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;

  // table styling
  groupExpansion = false;
  tableData: FoodItem[];
  tableDataFilter: FoodItem[];
  columns = [
              { name: 'Date', prop: 'dateStr'},
              { name: 'Name', prop: 'name'},
              { name: 'Serving', prop: 'serving'},
              { name: 'Calories', prop: 'caloriesIn'},
              { name: 'Protein', prop: 'protein'},
              { name: 'Carb', prop: 'carb'},
              { name: 'Fat', prop: 'fat'}
            ];
colAction = [{ name: 'Actions', prop: 'actions'}];
allColumns = [
              { name: 'Date', prop: 'dateStr'},
              { name: 'Name', prop: 'name'},
              { name: 'Serving', prop: 'serving'},
              { name: 'Calories', prop: 'caloriesIn'},
              { name: 'Protein', prop: 'protein'},
              { name: 'Carb', prop: 'carb'},
              { name: 'Fat', prop: 'fat'}
            ];
  allAction = [{ name: 'Actions', prop: 'actions'}];
  
  tableClass = 'light';
  tableStyle = 'light';


  constructor(private profileService: ProfileService,
              public foodService: FoodService,
              private authService: AuthService) { }

  ngOnInit() {

    this.foodLogSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.fetchAllFoodItems(this.loggedUserProfile.userId);
      })
    );

    this.foodLogSubs.push(this.authService.user // getter, not event emitter
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
    this.foodLogSubs.push(this.groupSum.changes.subscribe(result => {
      if (this.table.groupedRows) {
        setTimeout(() => { // to avoid expression has changed after it was checked
          this.table.groupedRows.map(group => {
            const totalCaloriesGroup = group.value.map(ex => ex.caloriesIn).reduce((acc, value) => acc + value, 0);
            group.groupCalories = totalCaloriesGroup;
          }, 1);
        });
      }
    }));
  }

  fetchAllFoodItems(userFirebaseId: string) {
    this.foodLogSubs.push(this.foodService.finishedFoodItemsChanged
    .subscribe((foodItem: FoodItem[]) => {
      this.tableData = foodItem;
      this.tableDataFilter = foodItem;
    }));
    this.foodService.fetchCompletedFoodItems(userFirebaseId);
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
    if (this.foodLogSubs) {
      this.foodLogSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
