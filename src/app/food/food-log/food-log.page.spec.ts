import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodLogPage } from './food-log.page';

describe('FoodLogPage', () => {
  let component: FoodLogPage;
  let fixture: ComponentFixture<FoodLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodLogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
