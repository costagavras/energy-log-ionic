import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { FoodService } from '../food.service';
import { ProfileService } from '../../profile/profile.service';
import { AuthService } from '../../auth/auth.service';

import { FoodItem } from '../food-item.model';
import { User, UserProfile } from '../../auth/user.model';

import { Subscription, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-food-manage',
  templateUrl: './food-manage.page.html',
  styleUrls: ['./food-manage.page.scss'],
})
export class FoodManagePage implements OnInit, OnDestroy {

  @Output() optionSelected: EventEmitter<any>;
  @ViewChild('f', {static: false}) addFoodForm: NgForm;
  @ViewChild('filterSearchBar', {static: false}) filterSearch: IonicSelectableComponent;

  minValue = 0;
  name: string;
  disabledDeleteButton = true;
  disabledUpdateButton = true;
  disableAddButton = true;
  nameExists = false;
  today = new Date();
  foodCategories = ['beverages', 'dairy', 'desserts', 'dishes', 'fats', 'fish', 'fruits', 'grains',
                    'meat', 'vegetables', 'other'];
  private addFoodSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;
  foodItems: FoodItem[];
  searchFoundItem: FoodItem;
  oldFoodItemName: string;
  filteredFoodItems: Observable<FoodItem[]>;

  constructor(public foodService: FoodService,
              private profileService: ProfileService,
              private authService: AuthService) { }



  ngOnInit() {

    this.addFoodSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.foodService.fetchCustomFoodItems(this.loggedUserProfile.userId);
      })
    );

    this.addFoodSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

    this.addFoodSubs.push(this.foodService.customFoodItemsChanged
      .subscribe(foodItems => {
        this.foodItems = foodItems;
      }));

  }

  onDelete(user: UserProfile) {
    this.foodService.deleteCustomFood(user.userId, this.searchFoundItem);
    this.resetForm();
  }

  onAdd(user: UserProfile, form: NgForm) {
    if (this.oldFoodItemName === form.value.name) {
      console.log('same name');
      return;
    }
    this.foodService.saveCustomFood(
      user.userId,
      {
        name: form.value.name,
        serving: form.value.serving,
        caloriesIn: form.value.calories,
        fat: form.value.fat,
        carb: form.value.carb,
        protein: form.value.protein,
        category: form.value.foodCategory.toLowerCase()
      }
    );
  }


  onUpdate(user: UserProfile, form: NgForm) {
    this.foodService.saveCustomFood(
      user.userId,
      {
        name: form.value.name,
        serving: form.value.serving,
        caloriesIn: form.value.calories,
        fat: form.value.fat,
        carb: form.value.carb,
        protein: form.value.protein,
        category: form.value.foodCategory.toLowerCase()
      },
      // if no name change will update existing, if name change will delete old and add new food Item
      this.oldFoodItemName === form.value.name ? null : this.oldFoodItemName
    );
    this.oldFoodItemName = form.value.name;
  }

  onSelectionChanged(selectedFoodItem: FoodItem) {
    if (!selectedFoodItem) {
      this.resetForm();
      return;
    }
    this.searchFoundItem = selectedFoodItem;
    this.oldFoodItemName = selectedFoodItem.name;
    this.name = selectedFoodItem.name; // set name for food input in Edit/Add mode
    this.disabledDeleteButton = false;
    this.disabledUpdateButton = false;
    // using ViewChild
    this.addFoodForm.setValue({
      filterFoodItem: selectedFoodItem,
      foodCategory: selectedFoodItem.category,
      serving: selectedFoodItem.serving,
      fat: selectedFoodItem.fat,
      carb: selectedFoodItem.carb,
      protein: selectedFoodItem.protein,
      calories: selectedFoodItem.caloriesIn
    });
  }

  resetForm() {
    // using ViewChild
    this.addFoodForm.reset();
    this.searchFoundItem = null;
    this.oldFoodItemName = null;
    this.disabledDeleteButton = true;
    this.disabledUpdateButton = true;
    this.disableAddButton = true;
  }

  ionViewWillLeave() {
    this.resetForm();
  }

  nameChange(event: any) {
    const newName = event.target.value.trim();
    if (newName !== '' && newName !== this.oldFoodItemName) {
      this.disableAddButton = false;
      this.nameExists = this.foodItems.some(item => item.name === newName);
    } else if (newName === '') {
        this.disabledUpdateButton = true;
        this.disableAddButton = true;
    } else {
        this.disableAddButton = true;
    }
  }

  ngOnDestroy() {
    if (this.addFoodSubs) {
      this.addFoodSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
