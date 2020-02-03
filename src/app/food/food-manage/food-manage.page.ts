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
  name = ' ';
  today = new Date();
  foodCategories = ['beverages', 'dairy', 'desserts', 'dishes', 'fats', 'fish', 'fruits', 'grains',
                    'meat', 'vegetables', 'other'];
  private addFoodSubs: Subscription[] = [];
  private loggedUser: User;
  loggedUserProfile: UserProfile;
  foodItems: FoodItem[];
  searchFoundItem: FoodItem;
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
        // this.filteredFoodItems = this.filterControl.valueChanges
        // .pipe(
        //   startWith(''),
        //   map(value => value !== null ? typeof value === 'string' ? value : value.name : ''),
        //   map(name => name ? this._filter(name) : this.foodItems.slice())
        // );
      }));

  }

  onSave(user: UserProfile, form: NgForm, action: string) {
    if (action === 'delete' && !this.searchFoundItem) {
      this.foodService.saveCustomFood(user.userId, this.searchFoundItem, 'delete');
      this.resetForm();
    } else {
      this.foodService.saveCustomFood(
        user.userId,
        {
          name: form.value.name,
          serving: form.value.serving,
          caloriesIn: form.value.calories,
          fat: form.value.fat,
          carb: form.value.carb,
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
    if (!selectedFoodItem) {
      this.resetForm();
      return;
    }
    this.searchFoundItem = selectedFoodItem;
    this.name = selectedFoodItem.name; // set name for food input in E/Add mode
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
  }

  ionViewWillLeave() {
    this.resetForm();
  }

  // solution to avoid undefined input error on nameInput.hasError('required'),
  // probably related to search_toggle issue of being undefined on load
  deleteSpace() {
    this.name = '';
  }

  validInputForm(form: NgForm) {
    if (
          form.value.name === '' ||
          form.value.category === '' ||
          form.value.serving === '' ||
          form.value.fat === '' ||
          form.value.carb === '' ||
          form.value.protein === '' ||
          form.value.calories === ''
        ) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.addFoodSubs) {
      this.addFoodSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
