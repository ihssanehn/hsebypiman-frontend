import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserEditComponent } from './profile-user-edit.component';

describe('ProfileUserEditComponent', () => {
  let component: ProfileUserEditComponent;
  let fixture: ComponentFixture<ProfileUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUserEditComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
