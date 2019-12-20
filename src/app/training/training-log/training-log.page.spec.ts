import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingLogPage } from './training-log.page';

describe('TrainingLogPage', () => {
  let component: TrainingLogPage;
  let fixture: ComponentFixture<TrainingLogPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingLogPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
