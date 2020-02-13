import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, IonSearchbar, ActionSheetController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../profile/profile.service';
import { AuthService } from '../../auth/auth.service';
import { FoodService } from '../food.service';

import { User, UserProfile } from '../../auth/user.model';
import { FoodItem } from '../food-item.model';

import { usdaKey } from '../../../environments/environment.prod';
import { environment } from '../../../environments/environment';

import axios from 'axios';

@Component({
  selector: 'app-food-eat',
  templateUrl: './food-eat.page.html',
  styleUrls: ['./food-eat.page.scss'],
})
export class FoodEatPage implements OnInit, OnDestroy {

  @ViewChild('slides', {static: false}) slides: IonSlides;
  @ViewChild('nameSearch', {static: false}) searchBar: IonSearchbar;

  today: string;
  private loggedUser: User;
  loggedUserProfile: UserProfile;
  minValue = 0;

  // buttons for slider
  disablePrevBtn = true;
  disableNextBtn = false;

  branded = false;
  requireAllWords = false;
  totalHits: number;
  currentPage: number;
  totalPages: number;
  defaultPage = 1;

  usdaFoodItems = [] as any;
  usdaPickedFoodItem: FoodItem;
  usdaFoodItemDetailPaneOpen = false;
  usdaFoodItemDescription: string;
  usdaFoodItemDetail = [] as any;
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
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
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

  tableClass = 'bootstrap';
  tableStyle = 'light';

  constructor(private profileService: ProfileService,
              public foodService: FoodService,
              private authService: AuthService,
              private loadingController: LoadingController,
              private actionSheetController: ActionSheetController) { }

  ngOnInit() {

    this.today = new Date().toISOString();

    this.newFoodIntakeSubs.push(this.profileService.userProfileData
      .subscribe(
        userProfileData => {
          this.loggedUserProfile = userProfileData;
          if (this.loggedUserProfile !== null) {
            this.units = this.loggedUserProfile.units;
            // this filters food eaten today
            this.updateFilteredDate(this.loggedUserProfile.userId);
            this.triggerFetchFoodItems(this.loggedUserProfile.userId);
          }
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

       // subscription when filter date changes
    this.newFoodIntakeSubs.push(this.foodService.dateFilter
      .subscribe((date: Date) => {
        if (date) { // without the check undefined date from dateFilter Subject was getting through at template initialization
          this.filteredDay = date; // comes from datepicker change event formatted as 0:0:00
          this.startFilteredDay = new Date(this.filteredDay).setHours(0, 0, 0, 0);
          this.endFilteredDay = new Date(this.filteredDay).setHours(24, 0, 0, -1);
          this.updateFilteredDate(this.loggedUserProfile.userId);
        }
        })
    );
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

  switchStyle() {
    if (this.tableClass === 'dark') {
      this.tableClass = 'bootstrap';
      this.tableStyle = 'light';
    } else {
      this.tableClass = 'dark';
      this.tableStyle = 'dark';
    }
  }

  doFilter(filterValue: string) {
    const filteredValue = filterValue.trim().toLowerCase();
    const filteredData = [...this.tableDataFilter].filter(val => {
      return val.name.toLowerCase().indexOf(filteredValue) !== -1 || !filteredValue;
    });

    if (filterValue) {
      this.tableData = filteredData;
    } else {
      this.tableData = this.tableDataFilter;
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

  toggleAction(col) {
    const isChecked = this.isCheckedAction(col);

    if (isChecked) {
      this.colAction = this.colAction.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.colAction = [...this.colAction, col];
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

  // if found returns true, else false (if c.name = undefined)
  isCheckedAction(col) {
    return (
      this.colAction.find(c => {
        return c.name === col.name;
      }) !== undefined
    );
  }

  // axios request
  onPick(foodDetailID: number) {
    this.usdaFoodItemDetailPaneOpen = false;
    // don't need a proxy once it's in production (CORS issue)
    if (environment.production) {
      this.proxyURL = '';
    }
    this.loadingController.create({keyboardClose: true, message: 'Searching USDA database...'})
      .then(loadingEl => {
        loadingEl.present();
        this.usdaPickedFoodItem = {} as FoodItem;
        // test with GET method (https://fdc.nal.usda.gov/api-guide.html)
        axios.get(this.proxyURL + this.usdaFoodDetailsURL1 + foodDetailID + this.usdaFoodDetailsURL2 + usdaKey)
          .then(response => {
            this.usdaFoodItemDetail = response.data.foodNutrients;
            this.usdaPickedFoodItem = {
              name: response.data.description,
              serving: 100,
              caloriesIn: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1008)[0].amount,
              protein: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1003)[0].amount,
              fat: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1004)[0].amount,
              carb: this.usdaFoodItemDetail.filter(item => item.nutrient.id === 1005)[0].amount
            };
            this.usdaFoodItemDetailPaneOpen = true;
            loadingEl.dismiss();
          }).catch(err => {
            console.log(err, err.response);
          });
    });
  }

  onSearch(searchString: string, branded, allWords, page) {
    // don't need a proxy once it's in production (CORS issue)
    if (environment.production) {
      this.proxyURL = '';
    }
    this.loadingController.create({keyboardClose: true, message: 'Searching USDA database...'})
      .then(loadingEl => {
        loadingEl.present();
        this.usdaSearch = searchString;
        // test with POST method (https://fdc.nal.usda.gov/api-guide.html)
        axios.post(this.proxyURL + this.usdaFoodSearchURL + usdaKey,
            {
              generalSearchInput: searchString,
              includeDataTypes: {
                'Survey (FNDDS)': true,
                'Foundation': true,
                'Branded': branded
              },
              requireAllWords: allWords,
              pageNumber: typeof page === 'undefined' ? 1 : page
            }
          )
          .then(response => {
            this.usdaFoodItems = response.data.foods;
            this.totalHits = response.data.totalHits;
            this.currentPage = response.data.currentPage;
            this.totalPages = response.data.totalPages;
            this.usdaSearchResults = true;
            loadingEl.dismiss();
          })
          .catch(err => {
            console.log(err, err.response);
          });

      });
  }

  saveCustomFood(usdaPickedFoodItem: FoodItem) {

    this.actionSheetController.create({
      header: 'CHOOSE CATEGORY',
      buttons: this.createButtons(usdaPickedFoodItem)
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  createButtons(foodItem: FoodItem) {
    const buttons = [];
    for (const btn of this.foodCategories) {
      const button = {
        text: btn.toUpperCase(),
        cssClass: 'actionCtrl_button',
        handler: () => {
          foodItem.category = btn;
          this.foodService.saveCustomFood(this.loggedUserProfile.userId, foodItem);
        }
      };
      buttons.push(button);
    }
    buttons.push({
        text: 'CANCEL',
        cssClass: 'actionCtrl_cancelButton',
        role: 'cancel'
    });
    return buttons;
  }

  checkStartEnd() {
    const prom1 = this.slides.isBeginning();
    const prom2 = this.slides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

  ngOnDestroy() {
    if (this.newFoodIntakeSubs) {
      this.newFoodIntakeSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
