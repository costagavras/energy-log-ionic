import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserStamp, UserProfile } from '.././auth/user.model';
import * as firebase from 'firebase/app';

import { Subject, Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

userProfileData = new Subject<UserProfile>();
activitiesList = new Subject<any>();
unitsUserSelected = new Subject<string>();
dataSaved = new Subject<boolean>();
userStampsCollection = new Subject<UserStamp[]>();
userProfile: UserProfile;
units: string;

private profileServiceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private router: Router,
              private uiService: UIService) {}

  unitsSelected(units) {
    this.unitsUserSelected.next(units); // event emitter measurement units selected by user
  }

  getUserData(userId: string) {
    const userRef = this.db.collection('users').doc(userId);
    userRef.get().toPromise()
      .then(userPath => {
        if (userPath.exists) {
          this.profileServiceSubs.push(
            this.db.collection('users').doc(userId).valueChanges()
            .subscribe((userData: UserProfile) => {
              this.userProfileData.next(userData); // event emitter via Subject
              this.userProfile = userData;
            }, error => {
              this.uiService.showToast('Fetching user info failed, please try again later', 3000);
          }));
          return this.userProfile;
        }
      }).catch(err => {
          console.log('Error getting document', err);
        });
  }

  getUserStampData(userId) {
    this.profileServiceSubs.push(
      this.db.collection('users/' + userId + '/userStamp').valueChanges()
      .subscribe((userStamps: UserStamp[]) => {
        this.userStampsCollection.next(userStamps);
      }, error => {
        this.uiService.showToast('Fetching user info failed, please try again later', 3000);
      }
    ));
  }

  getActivitiesList() {
    this.profileServiceSubs.push(
      this.db.collection('activityLevelActivities').doc('list').valueChanges()
      .subscribe(actList => {
        this.activitiesList.next(actList);
    }));
  }

  addOrUpdateUser(userData: UserProfile) {
    this.db.collection('users').doc(userData.userId).snapshotChanges()
      .pipe(take(1)).toPromise().then(doc => {
        if (doc.payload.exists) {
          this.db.collection('users').doc(userData.userId).update(userData)
            .then(() => {
              // tslint:disable-next-line: no-string-literal
              this.uiService.showToast(doc.payload.data()['name'] + ' successfully updated', 3000);
              this.dataSaved.next(true);
            });
        } else {
          this.db.collection('users').doc(userData.userId).set(userData)
            .then(() => {
              this.uiService.showToast(userData.name + ' was successfully created', 3000);
              this.dataSaved.next(true);
            });
        }
    });
  }

  deleteProfile(user: UserProfile) {

    const collectionExRef = this.db.collection('users').doc(user.userId).collection('finishedExercises').ref;
    this.deleteCollection(collectionExRef, 100);

    const collectionFoodRef = this.db.collection('users').doc(user.userId).collection('finishedFoodItems').ref;
    this.deleteCollection(collectionFoodRef, 100);

    const collectionUserFoodRef = this.db.collection('users').doc(user.userId).collection('userFoodItems').ref;
    this.deleteCollection(collectionUserFoodRef, 100);

    const collectionStampRef = this.db.collection('users').doc(user.userId).collection('userStamp').ref;
    this.deleteCollection(collectionStampRef, 100);

    this.db.collection('users').doc(user.userId).delete()
          .then(() => {
            this.router.navigate(['/']);
            this.uiService.showToast(user.name + '\'s profile is now gone!', 3000);
          }).catch(error => {
            console.log(error);
          });
  }

  deleteCollection(collectionRef, batchSize) {
    const query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
        this.deleteQueryBatch(query, resolve, reject);
    });
  }

  deleteQueryBatch(query, resolve, reject) {
    query.get()
        .then(snapshot => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // changed firebase instance to 'myEnergy' initialized in app.module
            const batch = firebase.app('myEnergy').firestore().batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then(numDeleted => {
        if (numDeleted === 0) {
            resolve();
            return;
        }

        // Replacing Recurse on the next process tick, to avoid exploding the stack.
        setTimeout(() => {
            this.deleteQueryBatch(query, resolve, reject);
        }, 0);
    })
        .catch(reject);
  }

  cancelSubscriptions() {
    if (this.profileServiceSubs) {
      this.profileServiceSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
