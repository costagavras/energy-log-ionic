import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { User, UserProfile } from '../../auth/user.model';
import { AuthService } from '../../auth/auth.service';
import { FoodService } from '../food.service';
import { FoodItem } from '../food-item.model';

@Component({
  selector: 'app-food-eat',
  templateUrl: './food-eat.page.html',
  styleUrls: ['./food-eat.page.scss'],
})
export class FoodEatPage implements OnInit, OnDestroy {

  today: string;
  private loggedUser: User;
  loggedUserProfile: UserProfile;

  branded = false;
  requireAllWords = false;
  totalHits: number;
  currentPage: number;
  totalPages: number;
  defaultPage = 1;

  panelOpenState = false;
  usdaFoodItems = [] as any;
  usdaPickedFoodItem: FoodItem;
  usdaFoodItemDetailPaneOpen = false;
  usdaFoodItemDescription: string;
  usdaFoodItemDetail = [] as any;
  isLoadingFoodItems = false;
  isLoadingFoodItem = false;
  usdaSearchResults = false;
  units: string;
  usdaSearch: string;

  foodItemsBeverages: FoodItem[];
  foodItemsDairy: FoodItem[];
  foodItemsDesserts: FoodItem[];
  foodItemsDishes: FoodItem[];
  foodItemsFats: FoodItem[];
  foodItemsFish: FoodItem[];
  foodItemsFruits: FoodItem[];
  foodItemsGrains: FoodItem[];
  foodItemsMeat: FoodItem[];
  foodItemsVegetables: FoodItem[];
  foodItemsOther: FoodItem[];
  private newFoodIntakeSubs: Subscription[] = [];

  proxyURL = 'https://cors-anywhere.herokuapp.com/';
  usdaFoodSearchURL = 'https://api.nal.usda.gov/fdc/v1/search?api_key=';
  usdaFoodDetailsURL1 = 'https://api.nal.usda.gov/fdc/v1/';
  usdaFoodDetailsURL2 = '?api_key=';

  categoryTitle = 'Input food item and serving size (gr/oz)';
  foodCategories = ['beverages', 'dairy', 'desserts', 'dishes', 'fats', 'fish', 'fruits', 'grains',
  'meat', 'vegetables', 'other'];
  foodCategoriesObject = {} as any;

  // initial date filter setting
  filteredDay = new Date();
  startFilteredDay = new Date(this.filteredDay).setHours(0, 0, 0, 0);
  endFilteredDay = new Date(this.filteredDay).setHours(24, 0, 0, -1);
  // table styling
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
  tableClass = 'dark';
  tableStyle = 'dark';

  constructor(private profileService: ProfileService,
              public foodService: FoodService,
              private authService: AuthService) { }

  ngOnInit() {

    this.today = new Date().toISOString();

    this.newFoodIntakeSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          this.updateFilteredDate(this.loggedUserProfile.userId);
          this.triggerFetchFoodItems(this.loggedUserProfile.userId);
      })
    );

    this.newFoodIntakeSubs.push(this.authService.user // getter, not event emitter
      .subscribe(user => {
        this.loggedUser = user;
        if (this.loggedUser !== null) {
          this.profileService.getUserData(this.loggedUser.id); // event emitter for sub;
        }
      })
    );

    this.newFoodIntakeSubs.push(this.profileService.userProfileData
      .subscribe(
        user => (this.units = user.units)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsBeveragesChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.beverages = foodItems)
        ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsDairyChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.dairy = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsDessertsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.desserts = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsDishesChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.dishes = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsFatsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.fats = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsFishChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.fish = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsFruitsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.fruits = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsGrainsChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.grains = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsMeatChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.meat = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsVegetablesChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.vegetables = foodItems)
      ));

    this.newFoodIntakeSubs.push(this.foodService.foodItemsOtherChanged
      .subscribe(
        foodItems => (this.foodCategoriesObject.other = foodItems)
      ));
  }

  triggerFetchFoodItems(userFirebaseId: string) {
    this.foodService.fetchAvailableFoodItemsBeverages(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsDairy(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsDesserts(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsDishes(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsFats(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsFish(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsFruits(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsGrains(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsMeat(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsVegetables(userFirebaseId);
    this.foodService.fetchAvailableFoodItemsOther(userFirebaseId);
  }

  updateFilteredDate(userFirebaseId: string) {
    this.newFoodIntakeSubs.push(this.foodService.finishedFoodItemsChanged
    .subscribe((foodItem: FoodItem[]) => {
      this.tableData = foodItem.filter(val => {
        return val.date['seconds'] * 1000 >= this.startFilteredDay &&
        val.date['seconds'] * 1000  <= this.endFilteredDay;
      });
      this.tableDataFilter = this.tableData;
    }));
    this.foodService.fetchCompletedFoodItems(userFirebaseId);
  }

  ngOnDestroy() {
    if (this.newFoodIntakeSubs) {
      this.newFoodIntakeSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
