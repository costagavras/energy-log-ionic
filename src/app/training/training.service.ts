import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Subject, Subscription } from 'rxjs';

import { Exercise } from './exercise.model';
import { UserProfile, UserStamp } from '../auth/user.model';
import { UIService } from '../shared/ui.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exercisesTimeChanged = new Subject<Exercise[]>();
  exercisesQtyChanged = new Subject<Exercise[]>();
  exercisesCalChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  dateFilter = new Subject<Date>();

  private availableExercisesTime: Exercise[] = [];
  private availableExercisesQty: Exercise[] = [];
  private availableExercisesCal: Exercise[] = [];

  private chosenExercise: Exercise;

  private trainingServiceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService) {}

  fetchAvailableExercisesTime() {
    this.trainingServiceSubs.push(
      this.db.collection<Exercise>('availableExercisesTime', ref => ref.orderBy('name', 'asc')).snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            // name: doc.payload.doc.data()['name'],
            // duration: doc.payload.doc.data()['duration'],
            // quantity: doc.payload.doc.data()['quantity'],
            // calories: doc.payload.doc.data()['calories'],
            // date: doc.payload.doc.data()['date']
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercisesTime = exercises;
        this.exercisesTimeChanged.next([...this.availableExercisesTime]);
      }, error => {
        this.uiService.showToast('Fetching exercises failed, please try again later', 2000);
      }));
  }

  fetchAvailableExercisesQty() {
    this.trainingServiceSubs.push(
      this.db.collection<Exercise>('availableExercisesQty', ref => ref.orderBy('name', 'asc')).snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercisesQty = exercises;
        this.exercisesQtyChanged.next([...this.availableExercisesQty]);
      }, error => {
        this.uiService.showToast('Fetching exercises failed, please try again later', 2000);
      }));
  }

  fetchAvailableExercisesCal() {
    this.trainingServiceSubs.push(
      this.db.collection<Exercise>('availableExercisesCal', ref => ref.orderBy('name', 'asc')).snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as Exercise;
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercisesCal = exercises;
        this.exercisesCalChanged.next([...this.availableExercisesCal]);
      }, error => {
        this.uiService.showToast('Fetching exercises failed, please try again later', 2000);
      }));
  }

  saveExercise(exerciseDate: string, selectedId: string, volume: number, userData: UserProfile, param: string, addWeight: number) {
    let durationValue = 0;
    let caloriesOutValue = 0;
    let quantityValue = 0;
    if (param === 'exTime') {
      this.chosenExercise = this.availableExercisesTime.find(ex => ex.id === selectedId);
      durationValue = volume;
      caloriesOutValue = Math.round(volume * this.chosenExercise.caloriesOut * userData.weight);
      quantityValue = 0;
    } else if (param === 'exQty') {
      this.chosenExercise = this.availableExercisesQty.find(ex => ex.id === selectedId);
      durationValue = 0;
      caloriesOutValue = Math.round(volume * this.chosenExercise.caloriesOut * (userData.weight + addWeight));
      quantityValue = volume;
    } else if (param === 'exCal') {
      this.chosenExercise = this.availableExercisesCal.find(ex => ex.id === selectedId);
      durationValue = 0;
      caloriesOutValue = volume;
      quantityValue = 0;
    }
    this.addDataToDatabase({
      ...this.chosenExercise,
      duration: durationValue,
      quantity: quantityValue,
      caloriesOut: caloriesOutValue,
      dateStr: exerciseDate.substring(0, 10),
      date: new Date(new Date(exerciseDate).setHours(12, 0, 0, 0))
    }, {
      dateStr: exerciseDate.substring(0, 10),
      date: new Date(new Date(exerciseDate).setHours(12, 0, 0, 0)),
      age: userData.age,
      weight: userData.weight,
      bmi: userData.bmi,
      bmr: userData.bmr,
      activityLevel: userData.activityLevel
    }, userData.userId);
  }

  fetchCompletedExercises(userFirebaseId: string) {

    this.trainingServiceSubs.push(
      this.db.collection<Exercise>('users/' + userFirebaseId + '/finishedExercises', ref => ref.orderBy('date', 'desc')).valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    }, error => {
      this.uiService.showToast('Fetching exercises failed, please try again later', 2000);
    }));
  }

  filterDate(date) {
    this.dateFilter.next(date);
  }

  private addDataToDatabase(exercise: Exercise, userStamp: UserStamp, userFirebaseId: string) {
    this.db.collection('users').doc(userFirebaseId).collection('finishedExercises').add(exercise)
    .then(docRef => {
      this.db.collection('users').doc(userFirebaseId).collection('finishedExercises').doc(docRef.id).update({
        id: docRef.id
      });
      this.uiService.showToast('Exercise added', 1000);
    });
    this.db.collection('users').doc(userFirebaseId).collection('userStamp').doc(userStamp.dateStr).set(userStamp);
  }

  // called from the template
  deleteDataFromDatabase(exercise: Exercise, userFirebaseId: string) {
    this.db.collection('users').doc(userFirebaseId).collection('finishedExercises').doc(exercise.id).delete();
    this.uiService.showToast(exercise.name + ' was successfully deleted', 1000);
  }

  cancelSubscriptions() {
    if (this.trainingServiceSubs) {
      this.trainingServiceSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
