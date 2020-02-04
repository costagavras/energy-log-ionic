import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { FoodItem } from './food-item.model';
import { UIService } from './../shared/ui.service';
import { UserStamp, User, UserProfile } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  foodItemsBeveragesChanged = new Subject<FoodItem[]>();
  foodItemsDairyChanged = new Subject<FoodItem[]>();
  foodItemsDessertsChanged = new Subject<FoodItem[]>();
  foodItemsDishesChanged = new Subject<FoodItem[]>();
  foodItemsFatsChanged = new Subject<FoodItem[]>();
  foodItemsFishChanged = new Subject<FoodItem[]>();
  foodItemsFruitsChanged = new Subject<FoodItem[]>();
  foodItemsGrainsChanged = new Subject<FoodItem[]>();
  foodItemsMeatChanged = new Subject<FoodItem[]>();
  foodItemsVegetablesChanged = new Subject<FoodItem[]>();
  foodItemsOtherChanged = new Subject<FoodItem[]>();
  customFoodItemsChanged = new Subject<FoodItem[]>();

  finishedFoodItemsChanged = new Subject<FoodItem[]>();

  dateFilter = new Subject<Date>();

  userData: User;
  oldAddedFoodName: string;
  userFoodItemsCollection: string;
  userFirebaseId: string;

  private availableFoodItemsStorage = {} as any;

  private chosenFoodItem: FoodItem;
  private foodServiceSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService) {}

  fetchAvailableFoodItemsBeverages(userFirebaseId: string) {
    const userFoodItemsCollection = 'users/' + userFirebaseId + '/userFoodItems';
    this.foodServiceSubs.push(
      // this.db.collectionGroup<FoodItem>('userFoodItems', ref => ref.where('category', '==', 'Beverages'))
      this.db.collection<FoodItem>(userFoodItemsCollection, ref => ref.where('category', '==', 'beverages'))
      .snapshotChanges()
        .pipe(map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            } as FoodItem;
          });
        }))
        .subscribe((foodItems: FoodItem[]) => {
          this.availableFoodItemsStorage['beverages'] = foodItems;
          this.foodItemsBeveragesChanged.next([...this.availableFoodItemsStorage['beverages']]);
        }, error => {
          this.uiService.showToast('Fetching food items failed, please try again later', 2000);
    }));
  }

  fetchAvailableFoodItemsDairy(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'dairy'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['dairy'] = foodItems;
        this.foodItemsDairyChanged.next([...this.availableFoodItemsStorage['dairy']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsDesserts(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'desserts'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['desserts'] = foodItems;
        this.foodItemsDessertsChanged.next([...this.availableFoodItemsStorage['desserts']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsDishes(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'dishes'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['dishes'] = foodItems;
        this.foodItemsDishesChanged.next([...this.availableFoodItemsStorage['dishes']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsFats(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'fats'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['fats'] = foodItems;
        this.foodItemsFatsChanged.next([...this.availableFoodItemsStorage['fats']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsFish(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'fish'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['fish'] = foodItems;
        this.foodItemsFishChanged.next([...this.availableFoodItemsStorage['fish']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsFruits(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'fruits'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['fruits'] = foodItems;
        this.foodItemsFruitsChanged.next([...this.availableFoodItemsStorage['fruits']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsGrains(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'grains'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['grains'] = foodItems;
        this.foodItemsGrainsChanged.next([...this.availableFoodItemsStorage['grains']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsMeat(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'meat'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['meat'] = foodItems;
        this.foodItemsMeatChanged.next([...this.availableFoodItemsStorage['meat']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsVegetables(userFirebaseId: string) {
    this.foodServiceSubs.push(
      // this.db.collection<FoodItem>('availableFoodItemsVegetables', ref => ref.orderBy('name', 'asc')).snapshotChanges()
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'vegetables'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['vegetables'] = foodItems;
        this.foodItemsVegetablesChanged.next([...this.availableFoodItemsStorage['vegetables']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchAvailableFoodItemsOther(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems', ref => ref.where('category', '==', 'other'))
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.availableFoodItemsStorage['other'] = foodItems;
        this.foodItemsOtherChanged.next([...this.availableFoodItemsStorage['other']]);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  fetchCustomFoodItems(userFirebaseId: string) {
    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/userFoodItems').snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          } as FoodItem;
        });
      }))
      .subscribe((foodItems: FoodItem[]) => {
        this.customFoodItemsChanged.next(foodItems);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      }));
  }

  saveFoodItem(foodDate: string, name: string, size: number, userData: UserProfile, param: string, usdaFoodItem: FoodItem) {
    if (param !== 'usda') {
      this.chosenFoodItem = this.availableFoodItemsStorage[param].find(ex => ex.name === name);
    } else {
      this.chosenFoodItem = usdaFoodItem;
    }
    this.addDataToDatabase({
      ...this.chosenFoodItem,
      serving: size,
      caloriesIn: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.caloriesIn),
      protein: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.protein),
      carb: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.carb),
      fat: Math.round(size / this.chosenFoodItem.serving * this.chosenFoodItem.fat),
      // dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10).split('-').reverse().join('.'),
      // dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
      // date: new Date(foodDate.setHours(12, 0, 0, 0))
      dateStr: foodDate.substring(0, 10),
      date: new Date(new Date(foodDate).setHours(12, 0, 0, 0))
    },
    {
      // date: new Date(foodDate.setHours(12, 0, 0, 0)),
      // dateStr: new Date(foodDate.setHours(12, 0, 0, 0)).toISOString().substring(0, 10),
      dateStr: foodDate.substring(0, 10),
      date: new Date(new Date(foodDate).setHours(12, 0, 0, 0)),
      age: userData.age,
      weight: userData.weight,
      bmi: userData.bmi,
      bmr: userData.bmr,
      activityLevel: userData.activityLevel
    }, userData.userId);
  }


  deleteCustomFood(userFirebaseId: string, foodItem: FoodItem) {
    const itemName = foodItem.name;
    return this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(foodItem.name).delete()
    .then(() => {
      this.uiService.showToast(itemName + ' was successfully deleted', 2000);
      });
  }

  saveCustomFood(userFirebaseId: string, foodItem: FoodItem, oldName?: string) {

    // case Update - case name change - will delete and add new food Item;
    if (oldName) {
      return this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(oldName).delete()
        .then(() => {
          this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(foodItem.name).set(foodItem)
            .then(() => {
              this.uiService.showToast(foodItem.name + ' was updated in the database', 2000);
            });
        });
    }

    // case Add or Update with no name change - will simply rewrite the old food Item
    if (!oldName) {
      return this.db.collection('users').doc(userFirebaseId).collection('userFoodItems').doc(foodItem.name).set(foodItem)
      .then(() => {
        this.uiService.showToast(foodItem.name + ' was added to the database', 2000);
      });
    }

  }

fetchCompletedFoodItems(userFirebaseId: string) {

    this.foodServiceSubs.push(
      this.db.collection<FoodItem>('users/' + userFirebaseId + '/finishedFoodItems', ref => ref.orderBy('date', 'desc')).valueChanges()
      .subscribe((foodItem: FoodItem[]) => {
        this.finishedFoodItemsChanged.next(foodItem);
      }, error => {
        this.uiService.showToast('Fetching food items failed, please try again later', 2000);
      })
    );
  }

filterDate(date) {
    this.dateFilter.next(date);
  }

  private addDataToDatabase(foodItem: FoodItem, userStamp: UserStamp, userFirebaseId: string) {
    this.db.collection('users').doc(userFirebaseId).collection('finishedFoodItems').add(foodItem)
    .then(docRef => {
      this.db.collection('users').doc(userFirebaseId).collection('finishedFoodItems').doc(docRef.id).update({
        id: docRef.id
      });
      this.uiService.showToast(foodItem.name + ' was successfully added', 1000);
    });
    this.db.collection('users').doc(userFirebaseId).collection('userStamp').doc(userStamp.dateStr).set(userStamp);
  }

  // called from the template
  private deleteDataFromDatabase(foodItem: FoodItem, userFirebaseId: string) {
    this.db.collection('users').doc(userFirebaseId).collection('finishedFoodItems').doc(foodItem.id).delete();
    this.uiService.showToast(foodItem.name + ' was successfully deleted', 1000);
  }

  cancelSubscriptions() {
    if (this.foodServiceSubs) {
      this.foodServiceSubs.forEach(sub => sub.unsubscribe());
    }
  }
}

