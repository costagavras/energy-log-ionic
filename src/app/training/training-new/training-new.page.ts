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

  constructor(private profileService: ProfileService,
              public trainingService: TrainingService,
              private authService: AuthService) { }

  ngOnInit() {
    this.today = new Date().toISOString();

    this.newTrainingSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
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

    this.newTrainingSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.userWeight = userProfileData.weight;
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

  }

  segmentChanged(event: any) {
    this.exerciseType = event.target.value;
  }

  formatLabel(value: number) {
    const returnString = value + 'kg ' + Math.round(value / 0.454) + 'lb';
    return returnString;
  }

  ngOnDestroy() {
    if (this.newTrainingSubs) {
      this.newTrainingSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
