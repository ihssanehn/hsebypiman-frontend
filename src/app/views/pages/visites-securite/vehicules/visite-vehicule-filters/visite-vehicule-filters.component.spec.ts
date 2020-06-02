import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteVehiculeFiltersComponent } from './visite-vehicule-filters.component';

describe('VisiteVehiculeFiltersComponent', () => {
  let component: VisiteVehiculeFiltersComponent;
  let fixture: ComponentFixture<VisiteVehiculeFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteVehiculeFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteVehiculeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
