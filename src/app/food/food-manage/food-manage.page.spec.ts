import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodManagePage } from './food-manage.page';

describe('FoodManagePage', () => {
  let component: FoodManagePage;
  let fixture: ComponentFixture<FoodManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodManagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
