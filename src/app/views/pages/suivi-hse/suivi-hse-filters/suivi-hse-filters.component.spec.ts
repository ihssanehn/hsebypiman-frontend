import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviHseFiltersComponent } from './suivi-hse-filters.component';

describe('SuiviHseFiltersComponent', () => {
  let component: SuiviHseFiltersComponent;
  let fixture: ComponentFixture<SuiviHseFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviHseFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviHseFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
