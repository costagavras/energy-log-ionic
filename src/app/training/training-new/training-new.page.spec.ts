import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrainingNewPage } from './training-new.page';

describe('TrainingNewPage', () => {
  let component: TrainingNewPage;
  let fixture: ComponentFixture<TrainingNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
