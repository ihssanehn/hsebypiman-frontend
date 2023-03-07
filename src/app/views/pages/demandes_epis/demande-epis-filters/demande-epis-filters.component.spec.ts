import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeEpisFiltersComponent } from './demande-epis-filters.component';

describe('DemandeEpisFiltersComponent', () => {
  let component: DemandeEpisFiltersComponent;
  let fixture: ComponentFixture<DemandeEpisFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeEpisFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeEpisFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
