import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauserieDetailComponent } from './causerie-detail.component';

describe('CauserieDetailComponent', () => {
  let component: CauserieDetailComponent;
  let fixture: ComponentFixture<CauserieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauserieDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauserieDetailComponent);
    component = fixture.componentInstance;
    // fixture.markForCheck();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
