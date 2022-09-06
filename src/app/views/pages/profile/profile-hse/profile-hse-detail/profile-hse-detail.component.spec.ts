import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHseDetailComponent } from './profile-hse-detail.component';

describe('ProfileHseDetailComponent', () => {
  let component: ProfileHseDetailComponent;
  let fixture: ComponentFixture<ProfileHseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileHseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHseDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
