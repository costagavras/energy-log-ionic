import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodEatPage } from './food-eat.page';

describe('FoodEatPage', () => {
  let component: FoodEatPage;
  let fixture: ComponentFixture<FoodEatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodEatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodEatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
