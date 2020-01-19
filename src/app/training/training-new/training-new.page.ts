import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { TrainingService } from '../training.service';
import { User, UserProfile } from '../../auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-training-new',
  templateUrl: './training-new.page.html',
  styleUrls: ['./training-new.page.scss'],
})
export class TrainingNewPage implements OnInit, OnDestroy {

  today: string;
  exercisesTime: Exercise[];
  exercisesQty: Exercise[];
  exercisesCal: Exercise[];
  private newTrainingSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;
  userWeight: number;
  exerciseType = 'timeEx';
  minValue = 0;
  maxSlider = 25;
  minSlider = 0;
  stepSlider = 1;
  tickIntervalSlider = 1;
  returnWeight = '0kg / 0lb';

  displayedColumns = ['date', 'name', 'calories', 'duration', 'quantity', 'actions'];
  // initial date filter setting
  filteredDay = new Date();
  startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
  endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);
  dataSource: any;
  totalCalories: number;

  constructor(private profileService: ProfileService,
              public trainingService: TrainingService,
              private authService: AuthService) { }

  ngOnInit() {
    this.today = new Date().toISOString();

    this.newTrainingSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.updateFilteredDate();
      })
    );

    this.newTrainingSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

    this.newTrainingSubs.push(this.trainingService.exercisesTimeChanged
      .subscribe(
        exercises => (this.exercisesTime = exercises)
      ));
    this.trainingService.fetchAvailableExercisesTime();

    this.newTrainingSubs.push(this.trainingService.exercisesQtyChanged
    .subscribe(
      exercises => (this.exercisesQty = exercises)
    ));
    this.trainingService.fetchAvailableExercisesQty();

    this.newTrainingSubs.push(this.trainingService.exercisesCalChanged
    .subscribe(
      exercises => (this.exercisesCal = exercises)
    ));
    this.trainingService.fetchAvailableExercisesCal();

    // subscription when filter date changes
    this.newTrainingSubs.push(this.trainingService.dateFilter
    .subscribe((date: Date) => {
        this.filteredDay = date; // comes from datepicker change event formatted as 0:0:00
        this.startFilteredDay = this.filteredDay.setHours(0, 0, 0, 0);
        this.endFilteredDay = this.filteredDay.setHours(24, 0, 0, -1);
        this.updateFilteredDate();
      }));

  }

  updateFilteredDate() {
    // this.newTrainingSubs.push(this.trainingService.finishedExercisesChanged
    // .subscribe((exercises: Exercise[]) => {
    //   // this.dataSource.data = exercises;
    //   this.dataSource.data = exercises.filter(val => {
    //     return val.date['seconds'] * 1000 >= this.startFilteredDay &&
    //     val.date['seconds'] * 1000  <= this.endFilteredDay;
    //   });
    //   this.totalCalories = this.dataSource.data.map(ex => ex.caloriesOut).reduce((acc, value) => acc + value, 0);
    // }));
    this.trainingService.fetchCompletedExercises(this.loggedUserProfile.userId);
  }

  segmentChanged(event: any) {
    this.exerciseType = event.target.value;
  }

  formatLabel(value: number) {
    if (isNaN(value)) {
      value = 0;
    }
    this.returnWeight = value + 'kg / ' + Math.round(value / 0.454) + 'lb';
  }

  ngOnDestroy() {
    if (this.newTrainingSubs) {
      this.newTrainingSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
