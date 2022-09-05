import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHsePassportComponent } from './user-hse-passport.component';

describe('UserHsePassportComponent', () => {
  let component: UserHsePassportComponent;
  let fixture: ComponentFixture<UserHsePassportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHsePassportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHsePassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
