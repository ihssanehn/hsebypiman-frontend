import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarieFiltersComponent } from './salarie-filters.component';

describe('SalarieFiltersComponent', () => {
  let component: SalarieFiltersComponent;
  let fixture: ComponentFixture<SalarieFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalarieFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarieFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
