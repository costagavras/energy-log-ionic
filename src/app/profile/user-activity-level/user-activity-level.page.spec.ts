import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserActivityLevelPage } from './user-activity-level.page';

describe('UserActivityLevelPage', () => {
  let component: UserActivityLevelPage;
  let fixture: ComponentFixture<UserActivityLevelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActivityLevelPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserActivityLevelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
