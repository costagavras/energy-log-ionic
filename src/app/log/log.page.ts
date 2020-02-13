import { Component, OnInit, OnDestroy, ViewChildren, ViewChild, QueryList, AfterViewInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { AuthService } from '../auth/auth.service';
import { FoodService } from '../food/food.service';
import { TrainingService } from '../training/training.service';
import { Subscription } from 'rxjs';

import { User, UserProfile, UserStamp } from '../auth/user.model';
import { FoodItem } from '../food/food-item.model';
import { Exercise } from '../training/exercise.model';

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit, OnDestroy {

  @ViewChild('myTable', { static: false }) table: any;
  @ViewChildren('groupSummary') groupSum: QueryList<any>;

  private logSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;

  // table styling
  groupExpansion = false;
  tableData = [];
  objExercises: Exercise[] = [];
  objFoodItems: FoodItem[] = [];
  userStampData: UserStamp[] = [];

  totalCaloriesIn: number;
  totalCaloriesExercise: number;
  totalDayEnergyExpenditure: number;
  totalCaloriesBalance: number;

  logPeriods = ['date', 'week', 'month', 'year'];

  columns = [
              { name: 'Date', prop: 'dateStr'},
              { name: 'Energy+', prop: 'caloriesIn'},
              { name: 'Total Energy-', prop: 'totalEnergy'},
              { name: 'Exercise', prop: 'caloriesExercise'},
              { name: 'Balance', prop: 'balance'}
            ];
  allColumns = [
              { name: 'Date', prop: 'dateStr'},
              { name: 'Energy+', prop: 'caloriesIn'},
              { name: 'Total Energy-', prop: 'totalEnergy'},
              { name: 'Exercise', prop: 'caloriesExercise'},
              { name: 'Balance', prop: 'balance'}
            ];

  tableClass = 'bootstrap';
  tableStyle = 'light';

  constructor(private profileService: ProfileService,
              public trainingService: TrainingService,
              public foodService: FoodService,
              private authService: AuthService) { }

  ngOnInit() {

    this.logSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.trainingService.fetchCompletedExercises(this.loggedUserProfile.userId);
          this.foodService.fetchCompletedFoodItems(this.loggedUserProfile.userId);
          this.profileService.getUserStampData(this.loggedUserProfile.userId);
          this.transformData();
      })
    );

    this.logSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );
  }

  fetchFinishedExercises() {
    return new Promise (resolve => {
      this.logSubs.push(this.trainingService.finishedExercisesChanged
      .subscribe((exercises: Exercise[]) => {
        this.objExercises = exercises;
        resolve(this.objExercises);
      }));
    });
  }

  fetchAllEatenFood() {
    return new Promise (resolve => {
      this.logSubs.push(this.foodService.finishedFoodItemsChanged
      .subscribe((foodItem: FoodItem[]) => {
        this.objFoodItems = foodItem;
        resolve(this.objExercises);
      }));
    });
  }

  getUserStampInfo() {
    return new Promise (resolve => {
      this.logSubs.push(this.profileService.userStampsCollection
      .subscribe((userStamps: UserStamp[]) => {
        this.userStampData = userStamps;
        resolve(this.objExercises);
      }));
    });
  }

  async transformData() {
    await Promise.all([this.getUserStampInfo(), this.fetchFinishedExercises(), this.fetchAllEatenFood()]);

    const arCombinedData = Array().concat(this.objExercises, this.objFoodItems, this.userStampData);

    // accept array and key (property)
    const groupByProperty = (objectArray, property) => {
      // return the end result
      return objectArray.reduce((resultArray, currentValue) => {
        // create key from the property specified
        const key = currentValue[property];
        // if an array already present for key, push it to the array. Else create an array and push the object
        if (!resultArray[key]) {
          resultArray[key] = [];
        }
        // return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        resultArray[key].push(currentValue);
        return resultArray;
      }, {});
    };

    const groupedByDate = groupByProperty(arCombinedData, 'dateStr');

    const summaryByDay = Object.keys(groupedByDate).map((key => {
      const calsIn = groupedByDate[key].filter(keys => keys.caloriesIn > 0).reduce((total, obj) => obj.caloriesIn + total, 0);
      const calsExercise = groupedByDate[key].filter(keys => keys.caloriesOut > 0).reduce((total, obj) => obj.caloriesOut + total, 0);
      const totalEnergyDay = groupedByDate[key].find(keys => keys.bmr).bmr *
        groupedByDate[key].find(keys => keys.activityLevel).activityLevel + calsExercise;
      const endBalance = calsIn - totalEnergyDay;
      const getTimezoneOffset = new Date(key).getTimezoneOffset();
      const dateAdj4Tz = new Date((Date.parse(key) + (getTimezoneOffset * 60 * 1000)));
      const jan1 = new Date(dateAdj4Tz.getFullYear(), 0, 1);
      const weekNum = Math.ceil((((Date.parse(dateAdj4Tz.toString()) - Date.parse(jan1.toString())) / 86400000) + jan1.getDay() + 1) / 7 );
      const monthNum = dateAdj4Tz.getMonth();
      const yearNum = dateAdj4Tz.getFullYear();

      return {
        date: dateAdj4Tz,
        dateStr: dateAdj4Tz.toISOString().substring(0, 10),
        week: weekNum,
        month: monthNum + 1,
        year: yearNum,
        caloriesIn: Math.round(calsIn),
        caloriesExercise: Math.round(calsExercise),
        totalEnergy: Math.round(totalEnergyDay),
        balance: Math.round(endBalance)
      };
    }));

    // sorts groups in time order
    this.tableData = summaryByDay.sort((d1, d2) => d2.date.getTime() - d1.date.getTime());
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

  // if found returns true, else false (if c.name = undefined)
  isChecked(col) {
    return (
      this.columns.find(c => {
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

  // updates subtotals
  updateTable() {
    setTimeout(() => {
      this.table.groupedRows.map(group => {
        group.groupCaloriesIn = group.value.map(ex => ex.caloriesIn).reduce((acc, value) => acc + value, 0);
        group.groupCaloriesOutTotal = group.value.map(item => item.totalEnergy).reduce((acc, value) => acc + value, 0);
        group.groupCaloriesOutExercise = group.value.map(item => item.caloriesExercise).reduce((acc, value) => acc + value, 0);
        group.groupCaloriesBalance = group.value.map(item => item.balance).reduce((acc, value) => acc + value, 0);
      });
      this.toggleAllGroups();
      this.toggleAllGroups();
    }, 200);
  }

  ngOnDestroy() {
    if (this.logSubs) {
      this.logSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
