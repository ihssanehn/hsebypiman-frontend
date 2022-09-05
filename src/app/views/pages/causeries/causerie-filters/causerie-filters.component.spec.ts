import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauserieFiltersComponent } from './causerie-filters.component';

describe('CauserieFiltersComponent', () => {
  let component: CauserieFiltersComponent;
  let fixture: ComponentFixture<CauserieFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauserieFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauserieFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
