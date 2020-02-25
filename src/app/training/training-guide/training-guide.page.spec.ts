import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingGuidePage } from './training-guide.page';

describe('TrainingGuidePage', () => {
  let component: TrainingGuidePage;
  let fixture: ComponentFixture<TrainingGuidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingGuidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingGuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
