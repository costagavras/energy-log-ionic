import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodGuidePage } from './food-guide.page';

describe('FoodGuidePage', () => {
  let component: FoodGuidePage;
  let fixture: ComponentFixture<FoodGuidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodGuidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodGuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
