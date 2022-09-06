import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserDetailComponent } from './profile-user-detail.component';

describe('ProfileUserDetailComponent', () => {
  let component: ProfileUserDetailComponent;
  let fixture: ComponentFixture<ProfileUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
