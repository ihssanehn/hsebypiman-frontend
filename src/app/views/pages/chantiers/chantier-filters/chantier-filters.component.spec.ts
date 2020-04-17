import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChantierFiltersComponent } from './chantier-filters.component';

describe('ChantierFiltersComponent', () => {
  let component: ChantierFiltersComponent;
  let fixture: ComponentFixture<ChantierFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChantierFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChantierFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
