import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';

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
  today = new Date();
  foodCategories = ['beverages', 'dairy', 'desserts', 'dishes', 'fats', 'fish', 'fruits', 'grains',
                    'meat', 'vegetables', 'other'];
  private addFoodSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;
  foodItems: FoodItem[];
  filteredItem: FoodItem;
  filteredFoodItems: Observable<FoodItem[]>;
  filterControl = new FormControl();

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
        // this.filteredFoodItems = this.filterControl.valueChanges
        // .pipe(
        //   startWith(''),
        //   map(value => value !== null ? typeof value === 'string' ? value : value.name : ''),
        //   map(name => name ? this._filter(name) : this.foodItems.slice())
        // );
      }));

  }

  onSave(user: UserProfile, form: NgForm, filterValue: any, action: string) {
    if (action === 'delete') {
      this.foodService.saveCustomFood(user.userId, filterValue, 'delete');
      this.resetForm();
    } else {
      this.foodService.saveCustomFood(
        user.userId,
        {
          name: typeof filterValue === 'string' ? filterValue : filterValue.name,
          serving: form.value.serving,
          caloriesIn: form.value.calories,
          fat: form.value.fat,
          carb: form.value.carbohydrate,
          protein: form.value.protein,
          category: form.value.foodCategory.toLowerCase(),
        },
        action === 'update' ? this.foodService.oldAddedFoodName || this.name : null);
    }
  }

  displayFn(foodItem?: FoodItem): string | undefined {
    if (!foodItem) {
      return '';
    }
    return foodItem ? foodItem.name : undefined;
  }

  private _filter(name: string): FoodItem[] {
    if (name != null) {
    const filterValue = name.toLowerCase();
    return this.foodItems.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  onSelectionChanged(selectedFoodItem: FoodItem) {
    this.name = selectedFoodItem.name,
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
    this.filterSearch.clear();
  }

  ngOnDestroy() {
    if (this.addFoodSubs) {
      this.addFoodSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
